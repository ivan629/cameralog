import { useFormLogic } from './useHook';
import { CameraLogForm, LogDisplay } from './CameraLogForm';
import { Film, Plus } from 'lucide-react';

const App = () => {
    const { logs, showForm, setShowForm, getInitialFormData, saveLog, editingLog, setEditingLog } = useFormLogic();

    const handleAddRecord = () => {
        setEditingLog(null);
        setShowForm(true);
    };

    const handleEditRecord = (log) => {
        setEditingLog(log);
        setShowForm(true);
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

    return (
        <div className="min-h-screen bg-white">
            {/* Minimal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Film className="w-5 h-5 text-blue-600" />
                            <h1 className="text-lg font-medium text-gray-900">CameraLog</h1>
                        </div>

                        <button
                            onClick={handleAddRecord}
                            className="bg-blue-600 active:bg-blue-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                            aria-label="Add new record"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4">
                <LogDisplay logs={logs} onEditRecord={handleEditRecord} />

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