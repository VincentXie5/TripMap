/**
 * TripSettings Component - Handles trip configuration and date settings
 */
import { dateUtils } from '../utils/dateUtils.js';
import { validation } from '../utils/helpers.js';

export default class TripSettings {
    constructor(containerId, state) {
        this.containerId = containerId;
        this.state = state;
        this.element = null;
        this.listeners = {};

        this.init();
    }

    init() {
        this.render();
        this.initializeDatePickers();
        this.bindEvents();
    }

    render() {
        const container = document.getElementById(this.containerId);
        container.innerHTML = this.getTemplate();
        this.element = container;
    }

    getTemplate() {
        return `
            <div class="card">
                <div class="card-header">
                    <h5>Trip Settings</h5>
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <label for="tripName" class="form-label">Trip Name</label>
                        <input type="text" class="form-control" id="tripName"
                               value="${this.state.tripName}"
                               placeholder="Enter trip name">
                        <div class="form-text">Give your trip a memorable name</div>
                    </div>

                    <div class="row mb-3">
                        <div class="col">
                            <label for="startDate" class="form-label">Start Date</label>
                            <input type="text" class="form-control" id="startDate"
                                   placeholder="Select start date">
                            <div class="form-text">When does your trip begin?</div>
                        </div>
                        <div class="col">
                            <label for="endDate" class="form-label">End Date</label>
                            <input type="text" class="form-control" id="endDate"
                                   placeholder="Select end date">
                            <div class="form-text">When does your trip end?</div>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="tripDescription" class="form-label">Trip Description</label>
                        <textarea class="form-control" id="tripDescription"
                                  rows="2" placeholder="Optional: Describe your trip">${this.state.tripDescription || ''}</textarea>
                    </div>

                    <div class="mb-3">
                        <label for="tripBudget" class="form-label">Estimated Budget</label>
                        <div class="input-group">
                            <span class="input-group-text">$</span>
                            <input type="number" class="form-control" id="tripBudget"
                                   placeholder="0.00" min="0" step="0.01"
                                   value="${this.state.tripBudget || ''}">
                        </div>
                    </div>

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="autoOptimizeRoute"
                               ${this.state.autoOptimizeRoute ? 'checked' : ''}>
                        <label class="form-check-label" for="autoOptimizeRoute">
                            Auto-optimize route order
                        </label>
                        <div class="form-text">Automatically arrange locations for efficient travel</div>
                    </div>

                    <button id="generateDays" class="btn btn-primary w-100 mb-3">
                        Generate Trip Days
                    </button>

                    ${this.renderTripSummary()}
                </div>
            </div>
        `;
    }

    renderTripSummary() {
        if (!this.state.startDate || !this.state.endDate) {
            return '';
        }

        const days = this.state.getTripDays().length;
        const markerCount = this.state.markers.length;

        return `
            <div class="trip-summary mt-3 p-3 bg-light rounded">
                <h6>Trip Summary</h6>
                <div class="row text-center">
                    <div class="col">
                        <div class="fw-bold">${days}</div>
                        <small class="text-muted">Days</small>
                    </div>
                    <div class="col">
                        <div class="fw-bold">${markerCount}</div>
                        <small class="text-muted">Locations</small>
                    </div>
                    <div class="col">
                        <div class="fw-bold">${this.getAverageLocationsPerDay()}</div>
                        <small class="text-muted">Avg/Day</small>
                    </div>
                </div>
            </div>
        `;
    }

    getAverageLocationsPerDay() {
        const days = this.state.getTripDays().length;
        const markerCount = this.state.markers.length;
        return days > 0 ? (markerCount / days).toFixed(1) : '0';
    }

    initializeDatePickers() {
        // Initialize start date picker
        const startDatePicker = flatpickr("#startDate", {
            locale: "zh",
            dateFormat: "Y-m-d",
            minDate: "today",
            onChange: (selectedDates) => {
                if (selectedDates.length > 0) {
                    this.updateEndDateMinDate(selectedDates[0]);
                    this.validateDates();
                }
            }
        });

        // Initialize end date picker
        const endDatePicker = flatpickr("#endDate", {
            locale: "zh",
            dateFormat: "Y-m-d",
            minDate: "today"
        });

        // Set initial values if they exist in state
        if (this.state.startDate) {
            startDatePicker.setDate(this.state.startDate);
        }
        if (this.state.endDate) {
            endDatePicker.setDate(this.state.endDate);
        }
    }

    updateEndDateMinDate(startDate) {
        const endDatePicker = flatpickr("#endDate");
        endDatePicker.set('minDate', startDate);
    }

    bindEvents() {
        // Trip name input
        document.getElementById('tripName').addEventListener('input', (e) => {
            this.state.tripName = e.target.value;
            this.emit('tripNameChanged', e.target.value);
        });

        // Trip description input
        document.getElementById('tripDescription').addEventListener('input', (e) => {
            this.state.tripDescription = e.target.value;
            this.emit('tripDescriptionChanged', e.target.value);
        });

        // Trip budget input
        document.getElementById('tripBudget').addEventListener('input', (e) => {
            this.state.tripBudget = parseFloat(e.target.value) || 0;
            this.emit('tripBudgetChanged', this.state.tripBudget);
        });

        // Auto-optimize checkbox
        document.getElementById('autoOptimizeRoute').addEventListener('change', (e) => {
            this.state.autoOptimizeRoute = e.target.checked;
            this.emit('autoOptimizeChanged', e.target.checked);
        });

        // Generate days button
        document.getElementById('generateDays').addEventListener('click', () => {
            this.generateDays();
        });

        // Real-time validation for dates
        document.getElementById('startDate').addEventListener('change', () => {
            this.validateDates();
        });

        document.getElementById('endDate').addEventListener('change', () => {
            this.validateDates();
        });
    }

    validateDates() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const generateButton = document.getElementById('generateDays');

        if (startDate && endDate) {
            const isValid = dateUtils.isValidDateRange(startDate, endDate);

            if (!isValid) {
                generateButton.disabled = true;
                this.showDateError('End date must be after start date');
            } else {
                generateButton.disabled = false;
                this.hideDateError();
            }
        }
    }

    showDateError(message) {
        this.hideDateError(); // Clear existing errors

        const errorElement = document.createElement('div');
        errorElement.className = 'alert alert-warning mt-2 py-2';
        errorElement.innerHTML = `
            <small><i class="bi bi-exclamation-triangle"></i> ${message}</small>
        `;
        errorElement.id = 'dateError';

        const endDateGroup = document.getElementById('endDate').closest('.col');
        endDateGroup.appendChild(errorElement);
    }

    hideDateError() {
        const existingError = document.getElementById('dateError');
        if (existingError) {
            existingError.remove();
        }
    }

    generateDays() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        // Validate required fields
        const errors = validation.validateRequired({
            tripName: this.state.tripName,
            startDate: startDate,
            endDate: endDate
        });

        if (errors.length > 0) {
            alert('Please fill in all required fields: ' + errors.join(', '));
            return;
        }

        if (!dateUtils.isValidDateRange(startDate, endDate)) {
            alert('End date must be after start date');
            return;
        }

        // Update state with settings
        this.state.setTripDates(startDate, endDate);
        this.emit('daysGenerated', {
            startDate,
            endDate,
            tripName: this.state.tripName,
            days: this.state.getTripDays().length
        });

        // Update trip summary
        this.updateTripSummary();
    }

    updateTripSummary() {
        const summaryElement = this.element.querySelector('.trip-summary');
        if (summaryElement) {
            summaryElement.outerHTML = this.renderTripSummary();
        }
    }

    refresh() {
        this.updateTripSummary();

        // Update form fields with current state
        const tripNameInput = document.getElementById('tripName');
        if (tripNameInput && tripNameInput.value !== this.state.tripName) {
            tripNameInput.value = this.state.tripName;
        }

        const descriptionInput = document.getElementById('tripDescription');
        if (descriptionInput && descriptionInput.value !== (this.state.tripDescription || '')) {
            descriptionInput.value = this.state.tripDescription || '';
        }

        const budgetInput = document.getElementById('tripBudget');
        if (budgetInput && budgetInput.value !== (this.state.tripBudget || '')) {
            budgetInput.value = this.state.tripBudget || '';
        }

        const optimizeCheckbox = document.getElementById('autoOptimizeRoute');
        if (optimizeCheckbox) {
            optimizeCheckbox.checked = this.state.autoOptimizeRoute || false;
        }
    }

    // Load trip data into settings
    loadTrip(tripData) {
        this.state.tripName = tripData.name || '';
        this.state.tripDescription = tripData.description || '';
        this.state.tripBudget = tripData.budget || 0;
        this.state.autoOptimizeRoute = tripData.autoOptimize || false;

        if (tripData.startDate && tripData.endDate) {
            this.state.setTripDates(tripData.startDate, tripData.endDate);
        }

        this.refresh();
    }

    // Reset all settings
    reset() {
        this.state.tripName = '';
        this.state.tripDescription = '';
        this.state.tripBudget = 0;
        this.state.autoOptimizeRoute = false;
        this.state.startDate = null;
        this.state.endDate = null;

        // Clear form fields
        const startDatePicker = flatpickr("#startDate");
        const endDatePicker = flatpickr("#endDate");

        startDatePicker.clear();
        endDatePicker.clear();

        this.refresh();
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

    destroy() {
        // Clean up flatpickr instances
        const startDatePicker = flatpickr("#startDate");
        const endDatePicker = flatpickr("#endDate");

        if (startDatePicker) startDatePicker.destroy();
        if (endDatePicker) endDatePicker.destroy();

        // Remove event listeners
        this.listeners = {};
    }
}