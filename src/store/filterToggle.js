import { create } from "zustand";

const filterToggle = create((set) => ({
  status: window.innerWidth > 768, 
  toggleStatus: () => set((state) => ({ status: !state.status })),
  updateStatus: (newStatus) => set({ status: newStatus }),
}));

export default filterToggle;
