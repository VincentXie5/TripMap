import { dateUtils } from '../utils/dateUtils.js';
import TripRecord from './TripRecord.js';

export default class Sidebar {
    constructor(containerId, state) {
        this.containerId = containerId;
        this.state = state;
        this.tripRecords = [];
        this.listeners = {};

        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
        this.loadTripRecords();
    }

    render() {
        const container = document.getElementById(this.containerId);
        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h5>Trip History</h5>
                </div>
                <div class="card-body">
                    ${this.renderTripHistory()}
                    <div id="recordsContainer"></div>
                </div>
            </div>
        `;
    }

    renderTripHistory() {
        return `
            <div class="mb-3">
                <h6>Previous Trips</h6>
                <p class="text-muted small">View and manage your past travel experiences</p>
            </div>
            <div class="d-grid gap-2 mb-3">
                <button id="createNewTrip" class="btn btn-primary">
                    Create New Trip
                </button>
                <button id="refreshRecords" class="btn btn-outline-secondary">
                    Refresh List
                </button>
            </div>
            <div class="mb-3">
                <input type="text" class="form-control" id="searchRecords"
                       placeholder="Search trips...">
            </div>
        `;
    }

    renderTripRecords() {
        const recordsContainer = document.getElementById('recordsContainer');

        // Clear existing records
        this.tripRecords.forEach(record => record.destroy());
        this.tripRecords = [];
        recordsContainer.innerHTML = '';

        const records = this.state.getTripRecords();

        if (records.length === 0) {
            recordsContainer.innerHTML = `
                <div class="text-center text-muted py-4">
                    <p>No trip records found</p>
                    <p class="small">Start by creating your first trip</p>
                </div>
            `;
            return;
        }

        // Create TripRecord components for each record
        records.forEach(recordInfo => {
            const tripRecord = new TripRecord(recordInfo, this.state);

            // Listen to TripRecord events
            tripRecord.on('viewTrip', (tripId) => {
                this.emit('viewTrip', tripId);
            });

            tripRecord.on('editTrip', (tripId) => {
                this.emit('editTrip', tripId);
            });

            tripRecord.on('deleteTrip', (tripId) => {
                this.deleteTripRecord(tripId);
            });

            recordsContainer.appendChild(tripRecord.getElement());
            this.tripRecords.push(tripRecord);
        });
    }

    bindEvents() {
        // Create new trip button
        document.getElementById('createNewTrip').addEventListener('click', () => {
            this.emit('createNewTrip');
        });

        // Refresh records button
        document.getElementById('refreshRecords').addEventListener('click', () => {
            this.loadTripRecords();
        });

        // Search input
        document.getElementById('searchRecords').addEventListener('input', (e) => {
            this.filterRecords(e.target.value);
        });
    }

    loadTripRecords() {
        // Load trip records from state or storage
        this.state.loadTripRecords();
        this.renderTripRecords();
        this.emit('recordsLoaded');
    }

    filterRecords(searchTerm) {
        const filteredRecords = this.state.filterTripRecords(searchTerm);

        // Update display based on filtered results
        this.tripRecords.forEach(record => {
            const shouldShow = filteredRecords.some(filtered => filtered.id === record.id);
            record.getElement().style.display = shouldShow ? 'block' : 'none';
        });
    }

    deleteTripRecord(tripId) {
        this.state.deleteTripRecord(tripId);
        this.loadTripRecords();
        this.emit('tripDeleted', tripId);
    }

    refresh() {
        // Refresh all trip records
        this.tripRecords.forEach(record => {
            record.refresh();
        });
    }

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

    destroy() {
        // Clean up all trip records
        this.tripRecords.forEach(record => record.destroy());
        this.tripRecords = [];
    }
}