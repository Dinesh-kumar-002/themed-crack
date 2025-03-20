import { create } from 'zustand';
import axios from 'axios';
import userLoginStatus from './userLoginStatus'; // Importing the userLoginStatus store

const useOrderStore = create((set, get) => {
    const { loginUserEmail } = userLoginStatus.getState();

    // Immediately fetch orders if login email exists
    if (loginUserEmail) {
        (async () => {
            set({ loading: true });
            try {
                const response = await axios.post('http://myhitech.digitalmantraaz.com/api/myorder', { email: loginUserEmail });
                set({ orders: response.data.orders, loading: false });
            } catch (error) {
                set({ error: error.message, loading: false });
            }
        })();
    }

    return {
        orders: [],
        loading: true,
        error: null,

        // Manual fetch in case needed
        // fetchOrders: async (params) => {
        //     set({ loading: true });
        //     try {
        //         const response = await axios.post('http://myhitech.digitalmantraaz.com/api/myorder', params);
        //         set({ orders: response.data.orders, loading: false });
        //     } catch (error) {
        //         set({ error: error.message, loading: false });
        //     }
        // },
    };
});

export default useOrderStore;
