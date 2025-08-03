import { useState, useEffect } from 'react';
import { saveToStorage, getFromStorage, formatTimestamp, formatTimecode, generateId } from './utils';

const STORAGE_KEY = 'camera-logs';

export const useFormLogic = () => {
    const [logs, setLogs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingLog, setEditingLog] = useState(null);

    // Load logs from localStorage on mount
    useEffect(() => {
        const savedLogs = getFromStorage(STORAGE_KEY, []);
        console.log('Loading logs from storage:', savedLogs); // Debug log
        setLogs(savedLogs);
    }, []);

    // Save logs to localStorage whenever logs change
    useEffect(() => {
        if (logs.length >= 0) { // This condition is always true, even for empty array
            console.log('Saving logs to storage:', logs); // Debug log
            saveToStorage(STORAGE_KEY, logs);
        }
    }, [logs]);

    const getInitialFormData = () => {
        const now = new Date();
        return {
            camera: '',
            roll: '',
            take: '',
            scene: '',
            shot: '',
            slate: '',
            lens: '',
            filter: '',
            lut: '',
            fStop: '',
            shutter: '',
            iso: '',
            whiteBalance: '5600K',
            user: '',
            notes: '',
            circled: false,
            clips: 1,
            timestamp: formatTimestamp(now),
            timecode: formatTimecode(now)
        };
    };

    const saveLog = (formData, editId = null) => {
        try {
            if (editId) {
                // Update existing log
                setLogs(prevLogs =>
                    prevLogs.map(log =>
                        log.id === editId
                            ? { ...formData, id: editId, updatedAt: new Date().toISOString() }
                            : log
                    )
                );
                console.log('Updated log with ID:', editId);
            } else {
                // Create new log
                const newLog = {
                    ...formData,
                    id: generateId(),
                    createdAt: new Date().toISOString()
                };
                setLogs(prevLogs => [...prevLogs, newLog]);
                console.log('Created new log:', newLog);
            }
            return true;
        } catch (error) {
            console.error('Failed to save log:', error);
            return false;
        }
    };

    const deleteLog = (id) => {
        setLogs(prevLogs => prevLogs.filter(log => log.id !== id));
        console.log('Deleted log with ID:', id);
    };

    const getLogById = (id) => {
        return logs.find(log => log.id === id);
    };

    // Clear all logs (useful for debugging)
    const clearAllLogs = () => {
        setLogs([]);
        saveToStorage(STORAGE_KEY, []);
        console.log('Cleared all logs');
    };

    return {
        logs,
        showForm,
        setShowForm,
        editingLog,
        setEditingLog,
        getInitialFormData,
        saveLog,
        deleteLog,
        getLogById,
        clearAllLogs // Export for debugging
    };
};