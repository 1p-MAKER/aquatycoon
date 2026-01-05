import type { Fish, FishGenes } from '../types/schema';
import { Color } from 'three';

export class BreedingSystem {

    public static calculateChildGenes(parent1: Fish, parent2: Fish): FishGenes {
        // 1. Color Mixing (Average RGB + Noise)
        const c1 = new Color(parent1.genes.color);
        const c2 = new Color(parent2.genes.color);

        // Simple blend (50/50)
        let r = (c1.r + c2.r) / 2;
        let g = (c1.g + c2.g) / 2;
        let b = (c1.b + c2.b) / 2;

        // Mutation (Noise)
        const noise = 0.1;
        r += (Math.random() - 0.5) * noise;
        g += (Math.random() - 0.5) * noise;
        b += (Math.random() - 0.5) * noise;

        // Clamp
        r = Math.max(0, Math.min(1, r));
        g = Math.max(0, Math.min(1, g));
        b = Math.max(0, Math.min(1, b));

        const childColor = new Color(r, g, b).getHexString();

        // 2. Pattern Inheritance (50/50)
        const childPattern = Math.random() > 0.5 ? parent1.genes.pattern : parent2.genes.pattern;

        // 3. Scale Type Mutation (10% chance)
        let childScale = Math.random() > 0.5 ? parent1.genes.scaleType : parent2.genes.scaleType;
        if (Math.random() < 0.1) {
            const types = ['normal', 'metallic', 'luminescent'] as const;
            childScale = types[Math.floor(Math.random() * types.length)];
        }

        return {
            color: '#' + childColor,
            pattern: childPattern,
            scaleType: childScale,
            textureInfo: '/textures/goldfish.png' // Default texture
        };
    }
}
