import { create } from "zustand";

const AgencyAuthStore = create((set) => ({
  agency: null,
  isConnected: false,


  login: (agencyData) => set({ agency: agencyData, isConnected: true }),
  logout: () => set({ agency: null, isConnected: false }),

}));

export default AgencyAuthStore;