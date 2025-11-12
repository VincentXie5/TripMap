/**
 * Helper Utilities - Common utility functions used across the application
 */

// DOM manipulation helpers
export const domHelpers = {
    // Create element with attributes
    createElement(tag, attributes = {}, innerHTML = '') {
        const element = document.createElement(tag);
        Object.keys(attributes).forEach(key => {
            element.setAttribute(key, attributes[key]);
        });
        element.innerHTML = innerHTML;
        return element;
    },

    // Show loading state
    setLoading(element, isLoading) {
        if (isLoading) {
            element.classList.add('loading');
            element.setAttribute('disabled', 'true');
        } else {
            element.classList.remove('loading');
            element.removeAttribute('disabled');
        }
    },

    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Validation helpers
export const validation = {
    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validate date range
    isValidDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return end >= start;
    },

    // Validate required fields
    validateRequired(fields) {
        const errors = [];
        Object.keys(fields).forEach(key => {
            if (!fields[key] || fields[key].toString().trim() === '') {
                errors.push(`${key} is required`);
            }
        });
        return errors;
    },

    // Validate coordinates
    isValidCoordinates(lat, lng) {
        return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
    }
};

// Storage helpers
export const storage = {
    // Save to localStorage
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
            return false;
        }
    },

    // Get from localStorage
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Failed to read from localStorage:', error);
            return defaultValue;
        }
    },

    // Remove from localStorage
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Failed to remove from localStorage:', error);
            return false;
        }
    },

    // Clear all app-related storage
    clear() {
        try {
            const keys = Object.keys(localStorage).filter(key =>
                key.startsWith('travel-planner-')
            );
            keys.forEach(key => localStorage.removeItem(key));
            return true;
        } catch (error) {
            console.error('Failed to clear localStorage:', error);
            return false;
        }
    }
};

// Formatting helpers
export const formatters = {
    // Format date for display
    formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
    },

    // Format time for display
    formatTime(time) {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    },

    // Format duration between two times
    formatDuration(startTime, endTime) {
        if (!startTime || !endTime) return '';

        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        const diff = (end - start) / (1000 * 60); // difference in minutes

        if (diff < 60) {
            return `${diff} min`;
        } else {
            const hours = Math.floor(diff / 60);
            const minutes = diff % 60;
            return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
        }
    }
};

// Error handling
export const errorHandler = {
    // Handle API errors
    handleApiError(error) {
        console.error('API Error:', error);

        if (error.message.includes('NetworkError')) {
            return 'Network error: Please check your internet connection';
        } else if (error.message.includes('Failed to fetch')) {
            return 'Server unavailable: Please try again later';
        } else {
            return error.message || 'An unexpected error occurred';
        }
    },

    // Show user-friendly error message
    showError(message, duration = 5000) {
        // Create error toast notification
        const toast = domHelpers.createElement('div', {
            class: 'alert alert-danger position-fixed',
            style: 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;'
        }, message);

        document.body.appendChild(toast);

        // Auto remove after duration
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, duration);
    }
};