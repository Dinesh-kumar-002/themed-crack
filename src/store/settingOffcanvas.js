import { create } from "zustand";

const settingOffcanvas = create((set) => ({
  settingsOffcanvasStatus: false,
  toggleSettingsOffcanvas: () => set((state) => ({ settingsOffcanvasStatus: !state.settingsOffcanvasStatus })),
}));

export default settingOffcanvas;
