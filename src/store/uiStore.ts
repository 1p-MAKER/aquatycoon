import { create } from 'zustand';

interface UIStore {
    selectedFishId: string | null;
    isModalOpen: boolean;
    isViewMode: boolean;

    openFishInfo: (fishId: string) => void;
    closeFishInfo: () => void;
    toggleViewMode: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
    selectedFishId: null,
    isModalOpen: false,
    isViewMode: false,

    openFishInfo: (fishId) => set({ selectedFishId: fishId, isModalOpen: true }),
    closeFishInfo: () => set({ selectedFishId: null, isModalOpen: false }),
    toggleViewMode: () => set((state) => ({ isViewMode: !state.isViewMode })),
}));
