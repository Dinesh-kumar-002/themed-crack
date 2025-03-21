import { create } from "zustand";
import axios from 'axios';

const settings = create((set) => ({
  minOrderValue: null,
  email: null,
  phone: null,
  address: null,
  photo: null,
  logo: null,
  shortDes: null,
  description: null,

  fetchData: async () => {
    try {
      const response = await axios.get('https://admin.vmpscrackers.com/api/setting');
      
      // Using a single set call to update the state
      set({
        minOrderValue: response.data.setting.min_order,
        email: response.data.setting.email,
        phone: response.data.setting.phone,
        address: response.data.setting.address,
        photo: response.data.setting.photo,
        logo: response.data.setting.logo,
        shortDes: response.data.setting.short_des,
        description: response.data.setting.description,
      });

      console.log('Data fetched successfully');

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },
}));

export default settings;
