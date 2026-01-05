import { create } from 'zustand';

interface UIStore {
    // Fish Info Modal
    selectedFishId: string | null;
    isModalOpen: boolean;
    openFishInfo: (fishId: string) => void;
    closeFishInfo: () => void;

    // View Mode
    isViewMode: boolean;
    toggleViewMode: () => void;

    // Settings Modal
    isSettingsOpen: boolean;
    toggleSettings: () => void;

    // Shop Modal
    isShopOpen: boolean;
    toggleShop: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
    // Fish Info Modal
    selectedFishId: null,
    isModalOpen: false,
    openFishInfo: (fishId) => set({ selectedFishId: fishId, isModalOpen: true }),
    closeFishInfo: () => set({ selectedFishId: null, isModalOpen: false }),

    // View Mode
    isViewMode: false,
    toggleViewMode: () => set((state) => ({ isViewMode: !state.isViewMode })),

    // Settings Modal
    isSettingsOpen: false,
    toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),

    // Shop Modal
    isShopOpen: false,
    toggleShop: () => set((state) => ({ isShopOpen: !state.isShopOpen })),
}));
