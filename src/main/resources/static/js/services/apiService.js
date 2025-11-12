/**
 * API Service - Handles all backend communication
 */
export const apiService = {

    // Trip-related API calls
    async saveTrip(tripData) {
        const response = await fetch('/api/trips', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tripData)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to save trip');
        }

        return response.json();
    },

    async getAllTrips() {
        const response = await fetch('/api/trips');
        if (!response.ok) {
            throw new Error('Failed to fetch trips');
        }
        return response.json();
    },

    async getTripById(id) {
        const response = await fetch(`/api/trips/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch trip');
        }
        return response.json();
    },

    async updateTrip(id, tripData) {
        const response = await fetch(`/api/trips/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tripData)
        });

        if (!response.ok) {
            throw new Error('Failed to update trip');
        }

        return response.json();
    },

    async deleteTrip(id) {
        const response = await fetch(`/api/trips/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete trip');
        }

        return response.json();
    },

    // Geocoding service for address to coordinates
    async geocodeAddress(address) {
        // Using OpenStreetMap Nominatim API for geocoding
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
        );

        if (!response.ok) {
            throw new Error('Geocoding service unavailable');
        }

        const results = await response.json();
        if (results.length === 0) {
            throw new Error('Address not found');
        }

        return {
            lat: parseFloat(results[0].lat),
            lng: parseFloat(results[0].lon),
            displayName: results[0].display_name
        };
    },

    // Reverse geocoding for coordinates to address
    async reverseGeocode(lat, lng) {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );

        if (!response.ok) {
            throw new Error('Reverse geocoding service unavailable');
        }

        const result = await response.json();
        return result.display_name || 'Unknown location';
    }
};