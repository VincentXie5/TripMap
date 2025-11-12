/**
 * DayPlan Component - Handles individual day itinerary display and management
 */
export default class DayPlan {
    constructor(dayInfo, state) {
        this.dayInfo = dayInfo;
        this.state = state;
        this.element = null;
        this.listeners = {};

        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
    }

    render() {
        this.element = document.createElement('div');
        this.element.className = 'day-plan';
        this.element.innerHTML = this.getTemplate();
    }

    getTemplate() {
        const markers = this.state.getMarkersByDay(this.dayInfo.day);

        return `
            <h6>Day ${this.dayInfo.day} - ${this.dayInfo.date}</h6>
            <div class="day-markers" id="day${this.dayInfo.day}Markers">
                ${this.renderMarkers(markers)}
            </div>
            <button class="btn btn-sm btn-outline-primary add-marker"
                    data-day="${this.dayInfo.day}">
                Add Location
            </button>
        `;
    }

    renderMarkers(markers) {
        if (markers.length === 0) {
            return '<p class="text-muted">No itinerary planned</p>';
        }

        return markers.map(marker => `
            <div class="marker-item p-2 border-bottom">
                <div class="d-flex justify-content-between">
                    <strong>${marker.time} - ${marker.name}</strong>
                    <button class="btn btn-sm btn-outline-danger delete-marker"
                            data-id="${marker.id}">
                        Delete
                    </button>
                </div>
                <small class="text-muted">${marker.description}</small>
            </div>
        `).join('');
    }

    bindEvents() {
        // Add marker button
        const addButton = this.element.querySelector('.add-marker');
        addButton.addEventListener('click', () => {
            this.emit('addMarker', this.dayInfo.day);
        });

        // Event delegation for delete buttons
        this.element.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-marker')) {
                const markerId = parseInt(e.target.getAttribute('data-id'));
                this.emit('deleteMarker', markerId);
            }
        });
    }

    refresh() {
        const newMarkers = this.state.getMarkersByDay(this.dayInfo.day);
        const markersContainer = this.element.querySelector('.day-markers');
        markersContainer.innerHTML = this.renderMarkers(newMarkers);
    }

    getElement() {
        return this.element;
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
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}