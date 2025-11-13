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
        this.autoOptimizeRoute = true;
        this.listeners = [];

        // 添加旅行记录存储
        this.tripRecords = [];
        this.loadTripRecords(); // 初始化时加载记录
    }

    // ... 你现有的方法保持不变 ...

    // Trip Records Management
    loadTripRecords() {
        try {
            const stored = localStorage.getItem('tripRecords');
            this.tripRecords = stored ? JSON.parse(stored) : [];
            this.notify();
        } catch (error) {
            console.error('Error loading trip records:', error);
            this.tripRecords = [];
        }
    }

    saveTripRecords() {
        try {
            localStorage.setItem('tripRecords', JSON.stringify(this.tripRecords));
        } catch (error) {
            console.error('Error saving trip records:', error);
        }
    }

    getTripRecords() {
        return this.tripRecords;
    }

    filterTripRecords(searchTerm) {
        if (!searchTerm) return this.tripRecords;

        const term = searchTerm.toLowerCase();
        return this.tripRecords.filter(record =>
            record.name.toLowerCase().includes(term) ||
            (record.destination && record.destination.toLowerCase().includes(term)) ||
            (record.description && record.description.toLowerCase().includes(term))
        );
    }

    addTripRecord(recordData) {
        const record = {
            id: `trip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
            name: recordData.name || 'Untitled Trip',
            destination: recordData.destination || '',
            startDate: recordData.startDate || this.startDate,
            endDate: recordData.endDate || this.endDate,
            description: recordData.description || this.tripDescription,
            budget: recordData.budget || this.tripBudget,
            markers: [...this.markers],
            routes: [...this.routes],
            duration: recordData.duration || this.getTripDays().length,
            imageUrl: recordData.imageUrl || null
        };

        this.tripRecords.unshift(record); // 添加到开头
        this.saveTripRecords();
        this.notify();
        return record;
    }

    deleteTripRecord(tripId) {
        this.tripRecords = this.tripRecords.filter(record => record.id !== tripId);
        this.saveTripRecords();
        this.notify();
    }

    getTripRecordById(tripId) {
        return this.tripRecords.find(record => record.id === tripId);
    }

    updateTripRecord(tripId, updates) {
        const recordIndex = this.tripRecords.findIndex(record => record.id === tripId);
        if (recordIndex !== -1) {
            this.tripRecords[recordIndex] = {
                ...this.tripRecords[recordIndex],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.saveTripRecords();
            this.notify();
            return this.tripRecords[recordIndex];
        }
        return null;
    }

    // 将当前行程保存为记录
    saveCurrentTripAsRecord(name, description = '') {
        return this.addTripRecord({
            name: name || this.tripName || `My Trip ${new Date().toLocaleDateString()}`,
            description: description || this.tripDescription,
            destination: this.getTripDestination(),
            duration: this.getTripDays().length
        });
    }

    // 从记录加载行程
    loadTripFromRecord(tripId) {
        const record = this.getTripRecordById(tripId);
        if (record) {
            this.tripName = record.name;
            this.tripDescription = record.description || '';
            this.tripBudget = record.budget || 0;
            this.startDate = record.startDate;
            this.endDate = record.endDate;
            this.markers = record.markers || [];
            this.routes = record.routes || [];
            this.notify();
            return true;
        }
        return false;
    }

    // 辅助方法：从标记点推断目的地
    getTripDestination() {
        if (this.markers.length === 0) return '';

        // 如果有标记点，返回第一个标记点的位置作为目的地
        const firstMarker = this.markers[0];
        return firstMarker.position ? firstMarker.position.name || '' : '';
    }

    // 获取旅行统计（增强版）
    getTripStats() {
        const days = this.getTripDays().length;
        const markerCount = this.markers.length;
        const avgPerDay = days > 0 ? (markerCount / days).toFixed(1) : 0;
        const totalRecords = this.tripRecords.length;

        return {
            days,
            markerCount,
            avgPerDay,
            budget: this.tripBudget,
            budgetPerDay: days > 0 ? (this.tripBudget / days).toFixed(2) : 0,
            totalRecords,
            lastRecord: this.tripRecords.length > 0 ? this.tripRecords[0].createdAt : null
        };
    }

    // 清空当前行程
    clearCurrentTrip() {
        this.tripName = '';
        this.tripDescription = '';
        this.tripBudget = 0;
        this.startDate = null;
        this.endDate = null;
        this.markers = [];
        this.routes = [];
        this.currentDay = null;
        this.currentMarker = null;
        this.notify();
    }
}