import { create } from "zustand";

const orderStatus = create((set) => ({
  orderedStatus: "done", 
  toggleOrderStatus: () => set({ orderedStatus: "done" }),
}));

export default orderStatus;
