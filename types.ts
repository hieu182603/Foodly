export type Screen =
    | "home"
    | "login"
    | "register"
    | "menu"
    | "admin-dashboard"
    | "reservation"
    | "cart";

export interface Dish {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    isBestSeller?: boolean;
}

export interface CartItem extends Dish {
    quantity: number;
}

export type UserRole = "customer" | "admin";

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

export type OrderStatus = "Completed" | "Cooking" | "Cancelled" | "Pending";

export interface Order {
    id: string;
    userId: number;
    customer: string;
    items: CartItem[];
    address?: string;
    phone?: string;
    paymentMethod: "cash" | "card";
    deliveryOption: "takeaway" | "delivery";
    total: number;
    status: OrderStatus;
    createdAt: string;
}
