export class TripState {
    constructor() {
        this.tripName = '';
        this.tripDescription = '';
        this.tripBudget = 0;
        this.startDate = null;
        this.endDate = null;
        this.markers = [];
        this.routes = [];
        this.currentDay = null;
        this.currentMarker = null;
        this.autoOptimizeRoute = true; // Default to true
        this.listeners = [];
    }

    // ... existing methods ...

    // Set trip description
    setTripDescription(description) {
        this.tripDescription = description;
        this.notify();
    }

    // Set trip budget
    setTripBudget(budget) {
        this.tripBudget = budget;
        this.notify();
    }

    // Set auto-optimize setting
    setAutoOptimize(enabled) {
        this.autoOptimizeRoute = enabled;
        this.notify();
    }

    // Get trip statistics
    getTripStats() {
        const days = this.getTripDays().length;
        const markerCount = this.markers.length;
        const avgPerDay = days > 0 ? (markerCount / days).toFixed(1) : 0;

        return {
            days,
            markerCount,
            avgPerDay,
            budget: this.tripBudget,
            budgetPerDay: days > 0 ? (this.tripBudget / days).toFixed(2) : 0
        };
    }
}