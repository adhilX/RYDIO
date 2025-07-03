import axios from "axios";

export const findLocation = async (lat: number|null, lng: number|null) => {
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