import { create } from "zustand";

const AuthStore = create((set) => ({
  user: null,
  isConnected: false,

  login: (userData) => set({ user: userData, isConnected: true }),
  logout: () => set({ user: null, isConnected: false }),
}));

export default AuthStore;