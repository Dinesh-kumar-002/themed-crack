import { create } from "zustand";

const settings = create((set, get) => ({
  settingData: [],
  fetchData: async () => {
    try {
      const res = await fetch('https://admin.vmpscrackers.com/api/setting'); // Adjust API endpoint
      const data = await res.json();
      set({ settingData: data.setting[0] });
      console.log(data.setting[0]);
      
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  },
 
}));

export default settings;
