import Map from './components/Map.js';
import Sidebar from './components/Sidebar.js';
import TripSettings from './components/TripSettings.js';
import MarkerModal from './components/MarkerModal.js';
import { TripState } from './services/stateService.js';

class TripMapApp {
    constructor() {
        this.state = new TripState();
        this.map = null;
        this.sidebar = null;
        this.tripSettings = null;
        this.modal = null;

        this.init();
    }

    init() {
        this.render();
        this.initializeComponents();
        this.bindEvents();
    }

    render() {
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = `
            <div class="container-fluid">
                <h1 class="my-3">TripMap</h1>
                <div class="row">
                    <div class="col-md-4">
                        <div id="trip-settings-container"></div>
                        <div id="sidebar-container"></div>
                    </div>
                    <div class="col-md-8" id="map-container"></div>
                </div>
            </div>
            <div id="modal-container"></div>
        `;
    }

    initializeComponents() {
        this.tripSettings = new TripSettings('trip-settings-container', this.state);
        this.map = new Map('map-container', this.state);
        this.sidebar = new Sidebar('sidebar-container', this.state);
        this.modal = new MarkerModal('modal-container', this.state);

        this.setupComponentCommunication();
    }

    setupComponentCommunication() {
        // Trip settings events
        this.tripSettings.on('daysGenerated', (tripData) => {
            this.sidebar.refresh();
            this.map.refresh();
        });

        this.tripSettings.on('tripNameChanged', (name) => {
            console.log('Trip name changed:', name);
        });

        this.tripSettings.on('autoOptimizeChanged', (enabled) => {
            if (enabled) {
                this.optimizeRoutes();
            }
        });

        // ... other communication setup
    }

    optimizeRoutes() {
        // Implement route optimization logic here
        console.log('Optimizing routes...');
        this.map.refresh();
    }

    // ... rest of the class
}

new TripMapApp();