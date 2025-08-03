import { useState } from 'react';
import { useFormLogic } from './useHook';
import { CameraLogForm } from './CameraLogForm';
import { LogDisplay } from './components';
import { Film, Plus, Share2, X, Check } from 'lucide-react';
import { ExportButton} from './components/ExportToPdf';

const App = () => {
    const { logs, showForm, setShowForm, getInitialFormData, saveLog, editingLog, setEditingLog } = useFormLogic();
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedLogs, setSelectedLogs] = useState(new Set());

    const handleAddRecord = () => {
        setEditingLog(null);
        setShowForm(true);
    };

    const handleEditRecord = (log) => {
        if (selectionMode) {
            toggleLogSelection(log.id);
        } else {
            setEditingLog(log);
            setShowForm(true);
        }
    };

    const handleSaveLog = (formData) => {
        const success = saveLog(formData, editingLog?.id);
        if (success) {
            setShowForm(false);
            setEditingLog(null);
        }
        return success;
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingLog(null);
    };

    const enterSelectionMode = () => {
        setSelectionMode(true);
        setSelectedLogs(new Set());
    };

    const exitSelectionMode = () => {
        setSelectionMode(false);
        setSelectedLogs(new Set());
    };

    const toggleLogSelection = (logId) => {
        const newSelected = new Set(selectedLogs);
        if (newSelected.has(logId)) {
            newSelected.delete(logId);
        } else {
            newSelected.add(logId);
        }
        setSelectedLogs(newSelected);
    };

    const selectAllLogs = () => {
        const allLogIds = new Set(logs.map(log => log.id));
        setSelectedLogs(allLogIds);
    };

    const deselectAllLogs = () => {
        setSelectedLogs(new Set());
    };

    const selectedCount = selectedLogs.size;
    const allSelected = selectedCount === logs.length && logs.length > 0;

    return (
        <div className="min-h-screen bg-white">
            {/* Minimal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Film className="w-5 h-5 text-blue-600" />
                            <h1 className="text-lg font-medium text-gray-900">
                                {selectionMode ? `${selectedCount} selected` : 'Omar Log'}
                            </h1>
                        </div>

                        {selectionMode ? (
                            <button
                                onClick={exitSelectionMode}
                                className="bg-gray-100 active:bg-gray-200 text-gray-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                                aria-label="Exit selection mode"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                onClick={handleAddRecord}
                                className="bg-blue-600 active:bg-blue-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                                aria-label="Add new record"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Selection Controls */}
            {selectionMode && logs.length > 0 && (
                <div className="sticky top-[65px] px-4 py-2 bg-gray-50 border-b border-gray-100 z-10">
                    <div className="flex justify-between items-center text-sm">
                        <button
                            onClick={allSelected ? deselectAllLogs : selectAllLogs}
                            className="text-blue-600 active:text-blue-700 font-medium"
                        >
                            {allSelected ? 'Deselect all' : 'Select all'}
                        </button>
                        <span className="text-gray-600">
                {selectedCount} of {logs.length} selected
            </span>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className={`px-4 ${logs.length > 0 ? 'pb-20' : 'pb-4'}`}>
                <LogDisplay
                    logs={logs}
                    onEditRecord={handleEditRecord}
                    selectionMode={selectionMode}
                    selectedLogs={selectedLogs}
                    onToggleSelection={toggleLogSelection}
                />

                {/* Empty State */}
                {logs.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Film className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-sm mb-6">No logs yet</p>
                        <button
                            onClick={handleAddRecord}
                            className="bg-blue-600 active:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
                        >
                            Add first log
                        </button>
                    </div>
                )}
            </div>

            {/* Bottom Action Bar */}
            {logs.length > 0 && !selectionMode && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3">
                    <div className="flex justify-center gap-3">
                        <button
                            onClick={enterSelectionMode}
                            className="bg-gray-50 active:bg-gray-100 text-gray-700 px-4 py-2.5 rounded-full text-sm font-medium transition-colors"
                            aria-label="Select logs to share"
                        >
                            Select logs
                        </button>
                        <button
                            onClick={() => {
                                enterSelectionMode();
                                selectAllLogs();
                            }}
                            className="bg-blue-50 active:bg-blue-100 text-blue-700 px-6 py-2.5 rounded-full flex items-center gap-2 text-sm font-medium transition-colors"
                            aria-label="Share all logs"
                        >
                            <Share2 className="w-4 h-4" />
                            Share all {logs.length}
                        </button>
                    </div>
                </div>
            )}

            {/* Selection Mode Bottom Bar */}
            {selectionMode && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3">
                    <div className="flex justify-center">
                        <ExportButton
                            logs={selectionMode
                                ? logs.filter(log => selectedLogs.has(log.id))
                                : logs}
                            disabled={selectedCount === 0}
                            className={`px-6 py-2.5 rounded-full flex items-center gap-2 text-sm font-medium transition-colors ${
                                selectedCount > 0
                                    ? 'bg-blue-600 active:bg-blue-700 text-white'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                            aria-label={`Share ${selectedCount} selected logs`}
                        >
                            <Share2 className="w-4 h-4" />
                            Share {selectedCount > 0 ? selectedCount : ''} selected
                        </ExportButton>
                    </div>
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 bg-white">
                    <div className="h-full w-full">
                        <CameraLogForm
                            initialData={editingLog || getInitialFormData()}
                            onSave={handleSaveLog}
                            onCancel={handleCancelForm}
                            isEditing={!!editingLog}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;