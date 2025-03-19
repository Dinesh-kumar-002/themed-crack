import { create } from "zustand";

const getLocalCart = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

const cartStore = create((set, get) => ({
  cart: getLocalCart(),

  addToCart: (id, cat_id, quantity = 1) => {
    set((state) => {
      const cart = [...state.cart];
      const index = cart.findIndex((item) => item.id === id);

      if (index !== -1) {
        cart[index] = { ...cart[index], quantity: cart[index].quantity + quantity };
      } else {
        
        cart.push({ id, cat_id, quantity });
      }

      return { cart };
    });

    console.log(get().cart);
    localStorage.setItem("cart", JSON.stringify(get().cart));
  },

  removeSingle: (id, quantity = 1) => {
    set((state) => {
      const cart = [...state.cart];
      const index = cart.findIndex((item) => item.id === id);

      if (index !== -1) {
        const newQuantity = cart[index].quantity - quantity;
        if (newQuantity > 0) {
          cart[index] = { ...cart[index], quantity: newQuantity };
        } else {
          cart.splice(index, 1); // Remove item if quantity <= 0
        }
      }

      return { cart };
    });

    console.log(get().cart);
    localStorage.setItem("cart", JSON.stringify(get().cart));
  },

  removeFromCart: (id) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    }));

    localStorage.setItem("cart", JSON.stringify(get().cart));
  },

  clearCart: () => {
    set({ cart: [] });
    localStorage.setItem("cart", JSON.stringify(get().cart));
  },

}));

export default cartStore;
