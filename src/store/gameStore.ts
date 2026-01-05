import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Fish, UserState, EnvironmentState } from '../types/schema';
import { BreedingSystem } from '../systems/BreedingSystem';
import { EconomySystem } from '../systems/EconomySystem';

interface GameStore {
    fishes: Fish[];
    user: UserState;
    environment: EnvironmentState;

    // Fish Actions
    addFish: (species: string) => void;
    updateFish: (id: string, updates: Partial<Fish>) => void;
    toggleFavorite: (id: string) => void;
    setFishName: (id: string, name: string) => void;
    removeFish: (id: string) => void;
    breedFish: (parent1Id: string, parent2Id: string) => void;

    marketTrend: number;
    updateMarket: () => void;
    sellFish: (id: string) => void;

    // User Actions
    addCoins: (amount: number) => void;
    spendCoins: (amount: number) => boolean;

    // Environment Actions
    toggleLightMode: () => void;
}

const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const INITIAL_FISH: Fish = {
    id: 'initial_fish_1',
    name: 'Beta',
    species: 'Goldfish',
    genes: {
        color: '#ffbd33',
        pattern: 'solid',
        scaleType: 'normal',
        textureInfo: '/textures/goldfish.png'
    },
    status: { hunger: 100, growth: 10, happiness: 100, health: 100 },
    isFavorite: false,
    birthDate: Date.now(),
};

export const useGameStore = create<GameStore>()(
    persist(
        (set, get) => ({
            fishes: [INITIAL_FISH],
            user: {
                coins: 100,
                inventory: [],
            },
            environment: {
                decorations: [],
                lightMode: 'day',
            },
            marketTrend: 1.0,

            addFish: (species: string) => set((state) => ({
                fishes: [...state.fishes, {
                    id: generateId(),
                    name: `Fish ${state.fishes.length + 1}`,
                    species,
                    genes: {
                        color: '#ffffff',
                        pattern: 'solid',
                        scaleType: 'normal',
                        textureInfo: '/textures/goldfish.png'
                    },
                    status: { hunger: 100, growth: 0, happiness: 100, health: 100 },
                    isFavorite: false,
                    birthDate: Date.now(),
                }]
            })),

            updateFish: (id, updates) => set((state) => ({
                fishes: state.fishes.map((f) => f.id === id ? { ...f, ...updates } : f)
            })),

            toggleFavorite: (id) => set((state) => ({
                fishes: state.fishes.map((f) => f.id === id ? { ...f, isFavorite: !f.isFavorite } : f)
            })),

            setFishName: (id, name) => set((state) => ({
                fishes: state.fishes.map((f) => f.id === id ? { ...f, name } : f)
            })),

            removeFish: (id) => set((state) => ({
                fishes: state.fishes.filter((f) => f.id !== id)
            })),

            addCoins: (amount) => set((state) => ({
                user: { ...state.user, coins: state.user.coins + amount }
            })),

            spendCoins: (amount) => {
                const { user } = get();
                if (user.coins >= amount) {
                    set({ user: { ...user, coins: user.coins - amount } });
                    return true;
                }
                return false;
            },

            toggleLightMode: () => set((state) => ({
                environment: { ...state.environment, lightMode: state.environment.lightMode === 'day' ? 'night' : 'day' }
            })),

            breedFish: (parent1Id: string, parent2Id: string) => set((state) => {
                const parent1 = state.fishes.find(f => f.id === parent1Id);
                const parent2 = state.fishes.find(f => f.id === parent2Id);

                if (!parent1 || !parent2) return {};

                const childGenes = BreedingSystem.calculateChildGenes(parent1, parent2);
                // Ensure child genes has texture info if BreedingSystem doesn't provide it
                const completeChildGenes = {
                    ...childGenes,
                    textureInfo: '/textures/goldfish.png'
                };

                const child: Fish = {
                    id: generateId(),
                    name: `Baby ${state.fishes.length + 1}`,
                    species: parent1.species,
                    genes: completeChildGenes,
                    status: { hunger: 100, growth: 0, happiness: 100, health: 100 },
                    isFavorite: false,
                    birthDate: Date.now(),
                };

                return { fishes: [...state.fishes, child] };
            }),

            updateMarket: () => set(() => ({
                marketTrend: EconomySystem.generateMarketTrend()
            })),

            sellFish: (id: string) => set((state) => {
                const fish = state.fishes.find(f => f.id === id);
                if (!fish) return {};

                const value = EconomySystem.calculateFishValue(fish, state.marketTrend);

                return {
                    fishes: state.fishes.filter(f => f.id !== id),
                    user: { ...state.user, coins: state.user.coins + value }
                };
            }),
        }),
        {
            name: 'aquatycoon-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
