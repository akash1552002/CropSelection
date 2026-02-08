export interface FertilizerResult {
    urea: number; // kg
    dap: number; // kg
    mop: number; // kg
    zinc?: number; // kg
}

export type Unit = 'Acre' | 'Hectare';
export type Stage = 'Basal (Sowing)' | 'Vegetative (20-40 Days)' | 'Flowering' | 'Fruiting';

const FERTILIZER_DATA: Record<string, { urea: number; dap: number; mop: number; zinc?: number }> = {
    // Standard dosages per Acre
    'Wheat': { urea: 100, dap: 50, mop: 25, zinc: 5 },
    'Rice': { urea: 80, dap: 60, mop: 30, zinc: 8 },
    'Maize': { urea: 90, dap: 60, mop: 40, zinc: 5 },
    'Sugarcane': { urea: 150, dap: 70, mop: 50, zinc: 10 },
    'Cotton': { urea: 120, dap: 50, mop: 30 },
    'Tomato': { urea: 80, dap: 80, mop: 40 },
    'Potato': { urea: 100, dap: 100, mop: 60 },
};

export const CalculatorService = {
    calculateFertilizer(crop: string, landSize: number, unit: Unit): FertilizerResult {
        // Convert Hectare to Acre if needed (1 Hectare approx 2.47 Acres)
        const sizeInAcres = unit === 'Hectare' ? landSize * 2.47 : landSize;

        const baseDosage = FERTILIZER_DATA[crop] || { urea: 50, dap: 50, mop: 25 }; // Default fallback

        return {
            urea: Math.round(baseDosage.urea * sizeInAcres),
            dap: Math.round(baseDosage.dap * sizeInAcres),
            mop: Math.round(baseDosage.mop * sizeInAcres),
            zinc: baseDosage.zinc ? Math.round(baseDosage.zinc * sizeInAcres) : undefined,
        };
    },

    getWaterAdvice(crop: string, stage: Stage): string {
        if (stage === 'Basal (Sowing)') {
            return "Ensure sufficient soil moisture for germination. Light irrigation recommended immediately after sowing.";
        }
        if (stage === 'Vegetative (20-40 Days)') {
            if (crop === 'Rice') return "Maintain 2-5 cm of standing water.";
            return "Keep soil moist but not waterlogged. Water every 7-10 days.";
        }
        if (stage === 'Flowering') {
            return "CRITICAL STAGE! Water stress now will yield poor quality. Ensure consistent moisture.";
        }
        if (stage === 'Fruiting') {
            return "Moderate watering. Avoid overhead sprinklers to prevent fungal issues on fruits.";
        }
        return "Regular irrigation as per soil type.";
    }
};
