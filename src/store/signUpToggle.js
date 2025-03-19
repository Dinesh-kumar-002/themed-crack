import { create } from "zustand";

const signUpToggle = create((set) => ({
  signUpStatus: false, 
  signUpStatusToggle: () => set((state) => ({ signUpStatus: !state.signUpStatus })),
}));

export default signUpToggle;
