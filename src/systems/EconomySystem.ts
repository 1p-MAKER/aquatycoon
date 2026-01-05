import type { Fish } from '../types/schema';

export class EconomySystem {

    public static calculateFishValue(fish: Fish, marketMultiplier: number): number {
        let value = 100; // Base Value

        // Growth Bonus
        value += fish.status.growth * 2;

        // Rare Gene Bonus
        if (fish.genes.scaleType === 'metallic') value += 500;
        if (fish.genes.scaleType === 'luminescent') value += 1000;

        // Market Multiplier
        return Math.floor(value * marketMultiplier);
    }

    public static generateMarketTrend(): number {
        // Simple sine wave based on current hour to simulate daily cycle
        // + Random noise for unpredictability
        const hour = new Date().getHours();
        const baseTrend = 1 + Math.sin((hour / 24) * Math.PI * 2) * 0.3; // 0.7 to 1.3
        const noise = (Math.random() - 0.5) * 0.2; // +/- 0.1

        return Math.max(0.5, Math.min(2.0, baseTrend + noise));
    }
}
