import { Dish, Order, User, CartItem } from "./types";

const API_BASE_URL = "http://localhost:9999";

// Helper function for API calls
const apiCall = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// Database service API
export const dbService = {
  // Get all dishes
  getDishes: async (): Promise<Dish[]> => {
    return apiCall<Dish[]>("/dishes");
  },

  // Get all orders
  getOrders: async (): Promise<Order[]> => {
    return apiCall<Order[]>("/orders");
  },

  // Get all users
  getUsers: async (): Promise<User[]> => {
    return apiCall<User[]>("/users");
  },

  // Get cart for user
  getCart: async (userId: number): Promise<CartItem[]> => {
    try {
      const carts = await apiCall<Record<number, CartItem[]>>("/carts");
      return carts[userId] || [];
    } catch {
      return [];
    }
  },

  // Set cart for user
  setCart: async (userId: number, cart: CartItem[]): Promise<void> => {
    try {
      const carts = await apiCall<Record<number, CartItem[]>>("/carts").catch(
        () => ({})
      );
      await apiCall("/carts", {
        method: "PUT",
        body: JSON.stringify({
          ...carts,
          [userId]: cart,
        }),
      });
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  },

  // Get wishlist for user
  getWishlist: async (userId: number): Promise<number[]> => {
    try {
      const wishlists = await apiCall<Record<number, number[]>>("/wishlists");
      return wishlists[userId] || [];
    } catch {
      return [];
    }
  },

  // Set wishlist for user
  setWishlist: async (userId: number, wishlist: number[]): Promise<void> => {
    try {
      const wishlists = await apiCall<Record<number, number[]>>(
        "/wishlists"
      ).catch(() => ({}));
      await apiCall("/wishlists", {
        method: "PUT",
        body: JSON.stringify({
          ...wishlists,
          [userId]: wishlist,
        }),
      });
    } catch (error) {
      console.error("Failed to save wishlist:", error);
    }
  },

  // Add order
  addOrder: async (order: Order): Promise<void> => {
    try {
      // Check if order already exists
      const orders = await dbService.getOrders();
      const exists = orders.some((o) => o.id === order.id);
      if (exists) {
        console.warn(`Order ${order.id} already exists, skipping...`);
        return;
      }

      await apiCall("/orders", {
        method: "POST",
        body: JSON.stringify(order),
      });
    } catch (error) {
      console.error("Failed to add order:", error);
      throw error;
    }
  },

  // Update order
  updateOrder: async (
    orderId: string,
    updates: Partial<Order>
  ): Promise<void> => {
    try {
      const orders = await dbService.getOrders();
      const orderIndex = orders.findIndex((o) => o.id === orderId);
      if (orderIndex === -1) {
        throw new Error(`Order ${orderId} not found`);
      }

      // json-server uses array index for updates, but we need to update by id
      // Since orders use string id, we'll replace the entire array
      const updatedOrders = orders.map((o) =>
        o.id === orderId ? { ...o, ...updates } : o
      );

      // Replace entire orders array
      await apiCall("/orders", {
        method: "PUT",
        body: JSON.stringify(updatedOrders),
      });
    } catch (error) {
      console.error("Failed to update order:", error);
      throw error;
    }
  },

  // Delete order
  deleteOrder: async (orderId: string): Promise<void> => {
    try {
      const orders = await dbService.getOrders();
      const orderIndex = orders.findIndex((o) => o.id === orderId);
      if (orderIndex === -1) {
        console.warn(`Order ${orderId} not found`);
        return;
      }

      // Remove order from array
      const updatedOrders = orders.filter((o) => o.id !== orderId);

      // Replace entire orders array
      await apiCall("/orders", {
        method: "PUT",
        body: JSON.stringify(updatedOrders),
      });
    } catch (error) {
      console.error("Failed to delete order:", error);
      throw error;
    }
  },

  // Add user
  addUser: async (user: User): Promise<void> => {
    try {
      await apiCall("/users", {
        method: "POST",
        body: JSON.stringify(user),
      });
    } catch (error) {
      console.error("Failed to add user:", error);
      throw error;
    }
  },

  // Update user
  updateUser: async (
    userId: number,
    updates: Partial<User>
  ): Promise<void> => {
    try {
      await apiCall(`/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  },

  // Export database (get all data and download as JSON)
  export: async (): Promise<void> => {
    try {
      const [dishes, orders, users, carts, wishlists] = await Promise.all([
        dbService.getDishes(),
        dbService.getOrders(),
        dbService.getUsers(),
        apiCall<Record<number, CartItem[]>>("/carts").catch(() => ({})),
        apiCall<Record<number, number[]>>("/wishlists").catch(() => ({})),
      ]);

      const db = {
        dishes,
        orders,
        users,
        carts,
        wishlists,
      };

      const dataStr = JSON.stringify(db, null, 4);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "database.json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export database:", error);
      alert("Không thể export database. Vui lòng thử lại.");
    }
  },
};
