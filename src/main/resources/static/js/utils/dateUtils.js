export const dateUtils = {
    initializeDatePickers() {
        flatpickr("#startDate", {
            locale: "zh",
            dateFormat: "Y-m-d",
            minDate: "today"
        });

        flatpickr("#endDate", {
            locale: "zh",
            dateFormat: "Y-m-d",
            minDate: "today"
        });
    },

    calculateDaysBetween(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    },

    isValidDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return end >= start;
    }
};