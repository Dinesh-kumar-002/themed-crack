import { create } from "zustand";

const loginOffcanvas = create((set) => ({
  loginOffcanvasStatus: false, 
  loginOffcanvasStatusToggle: () => set((state) => ({ loginOffcanvasStatus: !state.loginOffcanvasStatus })),
}));

export default loginOffcanvas;
