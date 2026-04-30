import { create } from 'zustand';
import { db } from '../lib/firebase';
import { ref, onValue, push, update, remove } from 'firebase/database';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  rating?: number;
  description?: string;
  badge?: string;
  stock?: number;
  cod?: boolean;
  freeDelivery?: boolean;
  deliveryCharge?: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface StoreState {
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  loading: boolean;
  fetchProducts: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (product: Product) => void;
  clearCart: () => void;
}

export const useStore = create<StoreState>((set) => ({
  products: [],
  cart: [],
  wishlist: [],
  loading: true,

  fetchProducts: () => {
    onValue(ref(db, 'products'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([id, val]: [string, any]) => ({
          id,
          ...val,
        }));
        set({ products: list, loading: false });
      } else {
        set({ products: [], loading: false });
      }
    });
  },

  addToCart: (product) => set((state) => {
    const existing = state.cart.find(item => item.id === product.id);
    if (existing) {
      return { cart: state.cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) };
    }
    return { cart: [...state.cart, { ...product, quantity: 1 }] };
  }),

  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter(item => item.id !== productId)
  })),

  updateQuantity: (productId, quantity) => set((state) => ({
    cart: state.cart.map(item => item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item).filter(item => item.quantity > 0)
  })),

  toggleWishlist: (product) => set((state) => {
    const isWishlisted = state.wishlist.find(item => item.id === product.id);
    if (isWishlisted) {
      return { wishlist: state.wishlist.filter(item => item.id !== product.id) };
    }
    return { wishlist: [...state.wishlist, product] };
  }),

  clearCart: () => set({ cart: [] })
}));