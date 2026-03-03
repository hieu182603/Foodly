export type Screen = 'home' | 'login' | 'register' | 'menu' | 'admin-dashboard';

export interface Dish {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    isBestSeller?: boolean;
}
