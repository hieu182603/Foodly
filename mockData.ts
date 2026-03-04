import database from "./database.json";
import { Dish, Order, User } from "./types";

const db = database as {
  dishes: Dish[];
  orders: Order[];
  users: User[];
};

export const DISHES: Dish[] = db.dishes;
export const ORDERS: Order[] = db.orders;
export const USERS: User[] = db.users;
