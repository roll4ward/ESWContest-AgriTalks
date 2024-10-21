import { create } from "zustand";

export const useRecordStore = create((set) => ({
  recorderId: "",
  setRecorderId: (recorderId) => set({ recorderId }),
}));

export default useStore;
