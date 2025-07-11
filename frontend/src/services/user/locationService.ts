import axios from "axios";

export const findLocation = async (lat: number | null, lng: number | null) => {
    try {
        const res = await axios(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        return res.data
    } catch (error) {
        throw new Error(
            `Failed to fetch location for coordinates (${lat}, ${lng}): ${error instanceof Error ? error.message : String(error)}`
        );
    }
};
interface Suggestion {
    display_name: string;
    lat: number;
    lon: number;
}

export async function fetchLocationSuggestions(query: string): Promise<Suggestion[]> {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
        );
        if (!response.ok) {
            throw new Error(`Error fetching location suggestions: ${response.statusText}`);
        }
        const data = await response.json();
        return data.map((item:Suggestion) => ({
            display_name: item.display_name,
            lat: +item.lat ,
            lon: +item.lon,
        }));
    } catch (error) {
        console.error("Failed to fetch location suggestions:", error);
        return [];
    }
}
