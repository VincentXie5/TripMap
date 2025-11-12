export default class MarkerModal {
    constructor(containerId, state) {
        this.containerId = containerId;
        this.state = state;
        this.modal = null;
        this.listeners = {};

        this.init();
    }

    init() {
        this.render();
        this.initializeModal();
        this.bindEvents();
    }

    render() {
        const container = document.getElementById(this.containerId);
        container.innerHTML = `
            <div class="modal fade" id="markerModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Add Marker</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="markerName" class="form-label">Location Name</label>
                                <input type="text" class="form-control" id="markerName">
                            </div>
                            <div class="mb-3">
                                <label for="markerDesc" class="form-label">Description</label>
                                <textarea class="form-control" id="markerDesc" rows="3"></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="markerTime" class="form-label">Time</label>
                                <input type="text" class="form-control" id="markerTime">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="saveMarker">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    initializeModal() {
        this.modal = new bootstrap.Modal(document.getElementById('markerModal'));

        // Initialize time picker
        flatpickr("#markerTime", {
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            time_24hr: true
        });
    }

    bindEvents() {
        document.getElementById('saveMarker').addEventListener('click', () => {
            this.saveMarker();
        });
    }

    open(latlng) {
        this.state.currentMarker = latlng;
        this.clearForm();
        this.modal.show();
    }

    saveMarker() {
        const name = document.getElementById('markerName').value;
        const desc = document.getElementById('markerDesc').value;
        const time = document.getElementById('markerTime').value;

        if (!name) {
            alert('Please enter location name');
            return;
        }

        const marker = {
            name,
            description: desc,
            time,
            latlng: this.state.currentMarker,
            day: this.state.currentDay
        };

        this.state.addMarker(marker);
        this.modal.hide();
        this.emit('markerSaved');
    }

    clearForm() {
        document.getElementById('markerName').value = '';
        document.getElementById('markerDesc').value = '';
        document.getElementById('markerTime').value = '';
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
}