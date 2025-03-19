import { create } from 'zustand';

const productStore = create((set) => ({
  products: [],
  loader:true,
  setLoader: (value) => set((state) => ({ loader: value })),
  fetchProducts: async () => {
    try {
      const res = await fetch('https://admin.vmpscrackers.com/api/allproducts'); // Adjust API endpoint
      const data = await res.json();
      set({ products: data });
      // console.error(data);
      
    } catch (error) {
      // console.error("Error fetching products:", error);
    }
  },
}));

export default productStore;
