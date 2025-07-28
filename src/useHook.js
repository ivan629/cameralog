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
        setLogs(savedLogs);
    }, []);

    // Save logs to localStorage whenever logs change
    useEffect(() => {
        if (logs.length >= 0) {
            saveToStorage(STORAGE_KEY, logs);
        }
    }, [logs]);

    const getInitialFormData = () => {
        const now = new Date();
        return {
            scene: '',
            take: '',
            camera: 'A',
            lens: '',
            notes: '',
            circled: false,
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
                            ? { ...formData, id: editId }
                            : log
                    )
                );
            } else {
                // Create new log
                const newLog = {
                    ...formData,
                    id: generateId(),
                    createdAt: new Date().toISOString()
                };
                setLogs(prevLogs => [...prevLogs, newLog]);
            }
            return true;
        } catch (error) {
            console.error('Failed to save log:', error);
            return false;
        }
    };

    const deleteLog = (id) => {
        setLogs(prevLogs => prevLogs.filter(log => log.id !== id));
    };

    const getLogById = (id) => {
        return logs.find(log => log.id === id);
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
        getLogById
    };
};