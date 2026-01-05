import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Fish, FishGenes, UserState, EnvironmentState } from '../types/schema';
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


// Fish Configuration
export const FISH_TYPES: Record<string, {
    name: string;
    cost: number;
    genes: FishGenes;
}> = {
    'Goldfish': {
        name: 'Goldfish',
        cost: 50,
        genes: {
            color: '#ffbd33',
            pattern: 'solid',
            scaleType: 'normal',
            textureInfo: '/textures/goldfish.png'
        }
    },
    'NeonTetra': {
        name: 'Neon Tetra',
        cost: 80,
        genes: {
            color: '#00ffff', // Cyan glow
            pattern: 'striped',
            scaleType: 'luminescent',
            textureInfo: '/textures/goldfish.png' // Placeholder: Use goldfish texture for now
        }
    }
};


const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const INITIAL_FISH: Fish = {
    id: 'initial_fish_1',
    name: 'Neo',
    species: 'NeonTetra',
    genes: FISH_TYPES['NeonTetra'].genes,
    status: { hunger: 100, growth: 10, happiness: 100, health: 100 },
    isFavorite: false,
    birthDate: Date.now(),
};

export const useGameStore = create<GameStore>()(
    persist(
        (set, get) => ({
            fishes: [INITIAL_FISH],
            user: {
                coins: 200, // Increased starting coins for Neon Tetra
                inventory: [],
            },
            environment: {
                decorations: [],
                lightMode: 'day',
            },
            marketTrend: 1.0,

            addFish: (speciesKey: string) => set((state) => {
                const fishConfig = FISH_TYPES[speciesKey];
                if (!fishConfig) return {};

                return {
                    fishes: [...state.fishes, {
                        id: generateId(),
                        name: `${fishConfig.name} ${state.fishes.length + 1}`,
                        species: speciesKey,
                        genes: fishConfig.genes,
                        status: { hunger: 100, growth: 0, happiness: 100, health: 100 },
                        isFavorite: false,
                        birthDate: Date.now(),
                    }]
                };
            }),

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
                const completeChildGenes = {
                    ...childGenes,
                    // Inherit texture from Mom (Parent 1) for now
                    textureInfo: parent1.genes.textureInfo
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
