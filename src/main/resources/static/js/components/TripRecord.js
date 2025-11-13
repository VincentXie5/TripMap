export default class TripRecord {
    constructor(recordData, state) {
        this.recordData = recordData;
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
        this.element.className = 'trip-record card mb-3';
        this.element.innerHTML = this.getTemplate();
    }

    getTemplate() {
        const { id, name, destination, startDate, endDate, duration, imageUrl, description } = this.recordData;

        return `
            <div class="card-body">
                ${imageUrl ? `
                    <img src="${imageUrl}" class="card-img-top mb-2" alt="${name}" style="height: 120px; object-fit: cover;">
                ` : ''}

                <h6 class="card-title">${name}</h6>

                <div class="trip-info small text-muted mb-2">
                    <div>${destination}</div>
                    <div>${startDate} - ${endDate}</div>
                    <div>${duration} days</div>
                </div>

                ${description ? `
                    <p class="card-text small">${description}</p>
                ` : ''}

                <div class="btn-group w-100" role="group">
                    <button type="button" class="btn btn-sm btn-outline-primary view-trip" data-trip-id="${id}">
                        View
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-secondary edit-trip" data-trip-id="${id}">
                        Edit
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger delete-trip" data-trip-id="${id}">
                        Delete
                    </button>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // View trip button
        this.element.querySelector('.view-trip').addEventListener('click', (e) => {
            const tripId = e.target.dataset.tripId;
            this.emit('viewTrip', tripId);
        });

        // Edit trip button
        this.element.querySelector('.edit-trip').addEventListener('click', (e) => {
            const tripId = e.target.dataset.tripId;
            this.emit('editTrip', tripId);
        });

        // Delete trip button
        this.element.querySelector('.delete-trip').addEventListener('click', (e) => {
            const tripId = e.target.dataset.tripId;
            if (confirm('Are you sure you want to delete this trip?')) {
                this.emit('deleteTrip', tripId);
            }
        });
    }

    update(updatedData) {
        this.recordData = { ...this.recordData, ...updatedData };
        this.element.innerHTML = this.getTemplate();
        this.bindEvents();
    }

    refresh() {
        this.element.innerHTML = this.getTemplate();
        this.bindEvents();
    }

    getElement() {
        return this.element;
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
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
        this.listeners = {};
    }
}