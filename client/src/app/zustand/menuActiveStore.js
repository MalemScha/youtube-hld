import { create } from 'zustand'

export const useMenuStore = create((set) => ({
   menuActive: false,
   toggleMenu: () => set((state) => ({menuActive: !state.menuActive}))
}))