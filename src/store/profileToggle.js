import { create } from "zustand";

const profileToggle = create((set) => ({
  profileStatus: false, 
  toggleProfileStatus: (status) => set({ profileStatus: status }),

}));

export default profileToggle;
