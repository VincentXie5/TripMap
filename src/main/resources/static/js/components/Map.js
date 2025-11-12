import { mapService } from '../services/mapService.js';

export default class Map {
    constructor(containerId, state) {
        this.containerId = containerId;
        this.state = state;
        this.map = null;
        this.listeners = {};

        this.init();
    }

    init() {
        this.render();
        this.initializeMap();
        this.bindMapEvents();
    }

    render() {
        const container = document.getElementById(this.containerId);
        container.innerHTML = `
            <div id="map"></div>
            <div class="mt-3">
                <button id="saveTrip" class="btn btn-success">Save Trip</button>
                <button id="clearAll" class="btn btn-danger">Clear All</button>
            </div>
        `;
    }

    initializeMap() {
        this.map = mapService.initializeMap('map', [39.9042, 116.4074], 10);
    }

    bindMapEvents() {
        // Map click event
        this.map.on('click', (e) => {
            this.emit('mapClick', e.latlng);
        });

        // Save trip button
        document.getElementById('saveTrip').addEventListener('click', () => {
            this.saveTrip();
        });

        // Clear all button
        document.getElementById('clearAll').addEventListener('click', () => {
            this.clearAll();
        });
    }

    refresh() {
        // Clear existing markers and routes
        mapService.clearMap(this.map);

        // Add markers
        this.state.markers.forEach(marker => {
            mapService.addMarker(this.map, marker);
        });

        // Draw routes
        this.drawRoutes();
    }

    drawRoutes() {
        const days = this.state.getTripDays();

        days.forEach(dayInfo => {
            const dayMarkers = this.state.getMarkersByDay(dayInfo.day);

            if (dayMarkers.length > 1) {
                const latlngs = dayMarkers.map(m => m.latlng);
                mapService.drawRoute(this.map, latlngs, `day-${dayInfo.day}`);
            }
        });
    }

    async saveTrip() {
        if (!this.state.tripName) {
            alert('Please enter trip name');
            return;
        }

        if (this.state.markers.length === 0) {
            alert('Please add at least one location');
            return;
        }

        try {
            await mapService.saveTrip(this.state);
            alert('Trip saved successfully!');
        } catch (error) {
            console.error('Save failed:', error);
            alert('Save failed: ' + error.message);
        }
    }

    clearAll() {
        if (confirm('Are you sure you want to clear all trip data?')) {
            mapService.clearMap(this.map);
            this.state.markers = [];
            this.state.routes = [];
            this.state.tripName = '';
            this.state.startDate = null;
            this.state.endDate = null;
            this.state.notify();
        }
    }

    // Event system
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }
}