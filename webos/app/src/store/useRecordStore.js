import { create } from "zustand";

type State = {
  recorderId: string,
};

type Action = {
  setRecorderId: (recorderId: State["recorderId"]) => void,
};

// prettier-ignore
export const useRecordStore = create<State & Action>((set) => ({
    recorderId: "",
    setRecorderId: (recorderId) => set(() => ({ recorderId : recorderId })),
  }));
