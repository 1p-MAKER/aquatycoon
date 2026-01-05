export interface FishGenes {
    color: string;
    textureInfo: string; // Added texture path
    pattern: 'solid' | 'striped' | 'spotted';
    scaleType: 'normal' | 'metallic' | 'luminescent';
}

export interface FishStatus {
    hunger: number; // 0-100 (0 = starving)
    growth: number; // 0-100 (100 = adult)
    happiness: number; // 0-100
    health: number; // 0-100
}

export interface Fish {
    id: string;
    name: string;
    species: string;
    genes: FishGenes;
    status: FishStatus;
    isFavorite: boolean;
    birthDate: number; // Timestamp
}

export interface EnvironmentState {
    decorations: string[];
    lightMode: 'day' | 'night';
}

export interface UserState {
    coins: number;
    inventory: string[];
}
