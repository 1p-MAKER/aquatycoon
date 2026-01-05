import { create } from 'zustand';

interface UIStore {
    selectedFishId: string | null;
    isModalOpen: boolean;

    openFishInfo: (fishId: string) => void;
    closeFishInfo: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
    selectedFishId: null,
    isModalOpen: false,

    openFishInfo: (fishId) => set({ selectedFishId: fishId, isModalOpen: true }),
    closeFishInfo: () => set({ selectedFishId: null, isModalOpen: false }),
}));
