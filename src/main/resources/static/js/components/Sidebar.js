import { dateUtils } from '../utils/dateUtils.js';
import DayPlan from './DayPlan.js';

export default class Sidebar {
    constructor(containerId, state) {
        this.containerId = containerId;
        this.state = state;
        this.dayPlans = [];
        this.listeners = {};

        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
    }

    render() {
        const container = document.getElementById(this.containerId);
        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h5>Trip Settings</h5>
                </div>
                <div class="card-body">
                    ${this.renderTripSettings()}
                    <div id="daysContainer"></div>
                </div>
            </div>
        `;
    }

    renderTripSettings() {
        return `
            <div class="mb-3">
                <label for="tripName" class="form-label">Trip Name</label>
                <input type="text" class="form-control" id="tripName"
                       value="${this.state.tripName}"
                       placeholder="Enter trip name">
            </div>
            <div class="row mb-3">
                <div class="col">
                    <label for="startDate" class="form-label">Start Date</label>
                    <input type="text" class="form-control" id="startDate"
                           placeholder="Select start date">
                </div>
                <div class="col">
                    <label for="endDate" class="form-label">End Date</label>
                    <input type="text" class="form-control" id="endDate"
                           placeholder="Select end date">
                </div>
            </div>
            <button id="generateDays" class="btn btn-primary w-100 mb-3">
                Generate Trip Days
            </button>
        `;
    }

    renderDayPlans() {
        const daysContainer = document.getElementById('daysContainer');

        // Clear existing day plans
        this.dayPlans.forEach(dayPlan => dayPlan.destroy());
        this.dayPlans = [];
        daysContainer.innerHTML = '';

        const days = this.state.getTripDays();

        if (days.length === 0) {
            return;
        }

        // Create DayPlan components for each day
        days.forEach(dayInfo => {
            const dayPlan = new DayPlan(dayInfo, this.state);

            // Listen to DayPlan events
            dayPlan.on('addMarker', (day) => {
                this.state.currentDay = day;
                this.emit('addMarker', day);
            });

            dayPlan.on('deleteMarker', (markerId) => {
                this.deleteMarker(markerId);
            });

            daysContainer.appendChild(dayPlan.getElement());
            this.dayPlans.push(dayPlan);
        });
    }

    bindEvents() {
        // Date pickers initialization
        dateUtils.initializeDatePickers();

        // Generate days button
        document.getElementById('generateDays').addEventListener('click', () => {
            this.generateDays();
        });

        // Trip name input
        document.getElementById('tripName').addEventListener('input', (e) => {
            this.state.tripName = e.target.value;
        });
    }

    generateDays() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        if (!startDate || !endDate) {
            alert('Please select start and end dates');
            return;
        }

        this.state.setTripDates(startDate, endDate);
        this.renderDayPlans();
        this.emit('daysGenerated');
    }

    deleteMarker(markerId) {
        this.state.deleteMarker(markerId);
        this.emit('markerDeleted');
    }

    refresh() {
        // Refresh all day plans
        this.dayPlans.forEach(dayPlan => {
            dayPlan.refresh();
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
        // Clean up all day plans
        this.dayPlans.forEach(dayPlan => dayPlan.destroy());
        this.dayPlans = [];
    }
}