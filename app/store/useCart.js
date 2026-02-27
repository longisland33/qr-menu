import { create } from "zustand";

export const useCart = create((set) => ({
  cart: [],
  
  // Səbətə əlavə et
  addToCart: (product) => set((state) => {
    const existing = state.cart.find((item) => item.id === product.id);
    if (existing) {
      return {
        cart: state.cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        ),
      };
    }
    return { cart: [...state.cart, { ...product, qty: 1 }] };
  }),

  // Səbətdən sil və ya sayını azalt
  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter((item) => item.id !== productId),
  })),

  // Səbəti tam təmizlə
  clearCart: () => set({ cart: [] }),
}));