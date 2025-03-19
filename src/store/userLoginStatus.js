import { create } from "zustand";
import Cookies from "universal-cookie";
import { toast } from 'react-toastify';

const cookies = new Cookies(null, { path: "/" });

const userLoginStatus = create((set) => ({
  loginStatus: cookies.get("userCookieEmail") ? true : false,
  loginUserEmail: cookies.get("userCookieEmail") || null,

  setLoginStatus: () => set((state) => ({ loginStatus: !state.loginStatus })),

  setLogin: (email) => {
    cookies.set("userCookieEmail", email, { path: "/" });
    set({ loginStatus: true, loginUserEmail: email });
  },

  logout: () => {
    cookies.remove("userCookieEmail", { path: "/" });
    toast.warn("Logged out 🙄 ",{position: "bottom-center",autoClose: 1000});
    set({ loginStatus: false, loginUserEmail: null });
  },

  refreshLoginStatus: () => {
    // Ensure state updates when cookies change
    const email = cookies.get("userCookieEmail") || null;
    set({ loginStatus: !!email, loginUserEmail: email });
  }
}));

export default userLoginStatus;
