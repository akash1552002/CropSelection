const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:5000/api';
// Base URL for images (remove /api from the end if present)
export const BASE_URL = API_URL.replace(/\/api$/, '');

export const getImageUrl = (imagePath?: string | null) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${BASE_URL}${imagePath}`;
};

export const fetchCrops = async () => {
    try {
        const response = await fetch(`${API_URL}/crops`);
        if (!response.ok) throw new Error('Failed to fetch crops');
        return await response.json();
    } catch (error) {
        console.error('Error fetching crops:', error);
        throw error;
    }
};

export const fetchCropSchedule = async (cropName: string) => {
    try {
        const response = await fetch(`${API_URL}/schedules/${cropName}`);
        if (!response.ok) throw new Error('Failed to fetch schedule');
        return await response.json();
    } catch (error) {
        console.error('Error fetching schedule:', error);
        // Fallback to empty schedule if not found to prevent app crash
        return null;
    }
};

export const fetchIrrigationData = async (cropName: string) => {
    try {
        const response = await fetch(`${API_URL}/irrigation/${cropName}`);
        if (!response.ok) throw new Error('Failed to fetch irrigation data');
        return await response.json();
    } catch (error) {
        console.error('Error fetching irrigation data:', error);
        return null;
    }
};
