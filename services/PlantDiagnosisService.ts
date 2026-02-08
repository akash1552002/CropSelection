// This service will handle the API calls to your AI model (e.g., Gemini, OpenAI, or a custom Flask server).
// For now, it returns a simulated successful response so we can build the UI.

export interface DiagnosisResult {
    diseaseName: string;
    confidence: number;
    description: string;
    treatment: string[];
    isHealthy: boolean;
}

export const diagnosePlant = async (imageUri: string): Promise<DiagnosisResult> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Simulate a random result for demonstration
    const isSick = Math.random() > 0.3; // 70% chance of being sick for demo purposes

    if (isSick) {
        return {
            diseaseName: "Leaf Rust (Puccinia triticina)",
            confidence: 0.92,
            isHealthy: false,
            description: "Leaf rust involves fungal lesions on leaf surfaces. It can reduce photosynthesis and stunt growth.",
            treatment: [
                "Apply fungicides containing tebuconazole or propiconazole.",
                "Remove and destroy infected leaves immediately.",
                "Ensure proper spacing between plants to reduce humidity.",
                "Rotate crops with non-host plants next season."
            ]
        };
    } else {
        return {
            diseaseName: "Healthy Plant",
            confidence: 0.98,
            isHealthy: true,
            description: "Your plant looks vibrant and healthy! No signs of disease detected.",
            treatment: [
                "Continue regular watering schedule.",
                "Monitor for pests weekly.",
                "Ensure adequate sunlight."
            ]
        };
    }
};
