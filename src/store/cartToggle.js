import { create } from "zustand";

const cartToggle = create((set) => ({
  cartStatus: false, 
  cartStatusToggle: () => set((state) => ({ cartStatus: !state.cartStatus })),
}));

export default cartToggle;
