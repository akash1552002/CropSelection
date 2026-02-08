// Mock Data for Fallback
const MOCK_MARKET_DATA = [
    { id: "1", crop: "Wheat", price: 2100, unit: "Qtl", trend: "up", change: "+50" },
    { id: "2", crop: "Rice", price: 2800, unit: "Qtl", trend: "stable", change: "0" },
    { id: "3", crop: "Cotton", price: 6500, unit: "Qtl", trend: "down", change: "-100" },
    { id: "4", crop: "Maize", price: 1800, unit: "Qtl", trend: "up", change: "+20" },
    { id: "5", crop: "Sugarcane", price: 300, unit: "Qtl", trend: "up", change: "+10" },
    { id: "6", crop: "Soybean", price: 4200, unit: "Qtl", trend: "down", change: "-50" },
    { id: "7", crop: "Tomato", price: 1500, unit: "Qtl", trend: "up", change: "+80" },
    { id: "8", crop: "Potato", price: 1200, unit: "Qtl", trend: "stable", change: "0" },
    { id: "9", crop: "Onion", price: 2500, unit: "Qtl", trend: "down", change: "-200" },
];

const API_KEY = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b"; // DEMO KEY
const API_URL = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${API_KEY}&format=json&limit=20`;

export const fetchMarketPrices = async () => {
    try {
        const response = await fetch(API_URL);
        const json = await response.json();

        if (json.records && json.records.length > 0) {
            return json.records.map((record: any, index: number) => ({
                id: String(index),
                crop: record.commodity,
                price: parseFloat(record.modal_price),
                unit: "Qtl",
                trend: Math.random() > 0.5 ? "up" : "down", // Simulated trend
                change: (Math.random() * 100).toFixed(0) // Simulated change
            }));
        } else {
            throw new Error("No records found");
        }
    } catch (error) {
        console.warn("Market API failed, using fallback data:", error);
        return MOCK_MARKET_DATA;
    }
};
