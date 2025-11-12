export const mapService = {
    initializeMap(containerId, center, zoom) {
        const map = L.map(containerId).setView(center, zoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        return map;
    },

    addMarker(map, markerInfo) {
        const marker = L.marker(markerInfo.latlng).addTo(map);
        marker.bindPopup(`
            <b>${markerInfo.name}</b><br>
            ${markerInfo.description}<br>
            Time: ${markerInfo.time}
        `);
        return marker;
    },

    drawRoute(map, latlngs, routeId) {
        return L.polyline(latlngs, { color: 'blue' })
            .addTo(map)
            ._leaflet_id = routeId;
    },

    clearMap(map) {
        map.eachLayer(layer => {
            if (layer instanceof L.Marker || layer instanceof L.Polyline) {
                map.removeLayer(layer);
            }
        });
    },

    async saveTrip(state) {
        const tripData = {
            name: state.tripName,
            startDate: state.startDate,
            endDate: state.endDate,
            markers: state.markers.map(marker => ({
                name: marker.name,
                description: marker.description,
                time: marker.time,
                latitude: marker.latlng.lat,
                longitude: marker.latlng.lng,
                day: marker.day
            }))
        };

        const response = await fetch('/api/trips', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tripData)
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text);
        }

        return response.json();
    }
};