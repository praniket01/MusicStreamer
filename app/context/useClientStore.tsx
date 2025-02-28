import { create } from "zustand";

type ClientsState = {
    clients: string[];
    setClients: (clients: string[]) => void;
};

export const useClientsStore = create<ClientsState>((set) => ({
    clients: [],
    setClients: (clients) => set({ clients }),
}));