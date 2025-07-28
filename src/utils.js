export const saveToStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
        return false;
    }
};

export const getFromStorage = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        console.log('item', item);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Failed to read from localStorage:', error);
        return defaultValue;
    }
};

export const formatTimestamp = (date) => {
    return date.toISOString().slice(0, 16);
};

export const formatTimecode = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const frames = String(Math.floor(date.getMilliseconds() / 41.67)).padStart(2, '0'); // 24fps
    return `${hours}:${minutes}:${seconds}:${frames}`;
};

export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};