import { create } from "zustand";

const myorder = create((set) => ({
  orderStatus: false, 
  toggleMyorderStatus: (status) => set({ orderStatus: status }),
}));

export default myorder;
