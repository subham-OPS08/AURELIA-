import { Product } from "./product";

export interface CartItem {
  id: string; // unique item id (product.id + size + color)
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: {
    name: string;
    hex: string;
  };
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  subtotal: number;
  addItem: (product: Product, size: string, color: { name: string; hex: string }, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}
