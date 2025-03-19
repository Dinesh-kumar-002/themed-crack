import { create } from "zustand";

const address = create((set) => ({
  addressStatus: false, 
  toggleAddressStatus: (status) => 
    set((state) => ({
      addressStatus: status !== undefined ? status : !state.addressStatus,
    })),
}));

export default address;
