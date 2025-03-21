import { create } from 'zustand';
import axios from 'axios';
import userLoginStatus from '../store/userLoginStatus'; // Importing the userLoginStatus store

const useOrderStore = create((set, get) => {
    const { loginUserEmail } = userLoginStatus.getState();

    if (loginUserEmail) {
        (async () => {
            set({ loading: true });
            try {
                const response = await axios.post('https://admin.vmpscrackers.com/api/myorder', { "email": loginUserEmail },{ withCredentials: false });
                set({ orders: response.data.orders, loading: false });
            } 
            catch (error) {
                set({ error: error.message, loading: false });
            }
        })();
    }

    return {
        orders: [],
        loading: true,
        error: null,
    };
});

export default useOrderStore;
