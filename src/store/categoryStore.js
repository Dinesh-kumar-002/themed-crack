import { create } from 'zustand';

const categoryStore = create((set) => ({
  categories: [],
  fetchCategories : async () => {
    try {
      const response = await fetch('https://admin.vmpscrackers.com/api/categorys');
      const data = await response.json();
      set({ categories: data });

    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }
}));

export default categoryStore;
