// Add this to your App.jsx to force engagement and trigger real prompt

import { useState, useEffect } from 'react';
import { useFormLogic } from './useHook';
import { CameraLogForm } from './CameraLogForm';
import { LogDisplay } from './components';
import { Film, Plus, Share2, X, Download } from 'lucide-react';
import { ExportButton } from './components/ExportToPdf';

const App = () => {
    const { logs, showForm, setShowForm, getInitialFormData, saveLog, editingLog, setEditingLog } = useFormLogic();
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedLogs, setSelectedLogs] = useState(new Set());

    // Install functionality
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [showInstallButton, setShowInstallButton] = useState(false);
    const [engagementStatus, setEngagementStatus] = useState('');

    useEffect(() => {
        // Check if already installed
        const checkInstalled = () => {
            return window.matchMedia('(display-mode: standalone)').matches ||
                window.navigator.standalone ||
                document.referrer.includes('android-app://');
        };

        setIsInstalled(checkInstalled());

        // FORCE ENGAGEMENT TO TRIGGER REAL PROMPT
        const forceEngagement = () => {
            // Method 1: Track visit count
            const visitCount = parseInt(localStorage.getItem('pwa-visit-count') || '0') + 1;
            localStorage.setItem('pwa-visit-count', visitCount.toString());
            setEngagementStatus(`Visit ${visitCount}/2`);

            // Method 2: Force user interaction time
            let timeSpent = 0;
            const timeInterval = setInterval(() => {
                timeSpent++;
                if (timeSpent >= 30) {
                    setEngagementStatus('30s engagement ✅');
                    clearInterval(timeInterval);
                }
            }, 1000);

            // Method 3: Simulate navigation (helps trigger prompt)
            setTimeout(() => {
                // Push a state to simulate navigation
                window.history.pushState({}, '', window.location.href + '#engaged');
                setTimeout(() => {
                    window.history.pushState({}, '', window.location.href.replace('#engaged', ''));
                }, 1000);
                setEngagementStatus(prev => prev + ' + Navigation ✅');
            }, 5000);

            // Method 4: If second visit, wait then check for prompt
            if (visitCount >= 2) {
                setEngagementStatus('Visit 2/2 ✅ - Waiting for prompt...');
                setTimeout(() => {
                    // Force check if prompt should be available
                    if (!deferredPrompt) {
                        setEngagementStatus('No auto-prompt - criteria not fully met');
                        setShowInstallButton(true); // Show manual option
                    }
                }, 10000); // Wait 10 seconds for prompt
            }

            return () => clearInterval(timeInterval);
        };

        const cleanup = forceEngagement();

        // Listen for the real install prompt
        const handleBeforeInstallPrompt = (e) => {
            console.log('🎉 REAL install prompt triggered!');
            setEngagementStatus('Real prompt available! ✅');
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallButton(true);
        };

        const handleAppInstalled = () => {
            console.log('✅ App installed via real prompt');
            setIsInstalled(true);
            setDeferredPrompt(null);
            setShowInstallButton(false);
            localStorage.setItem('pwa-installed', 'true');
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
            if (cleanup) cleanup();
        };
    }, []);

    const handleInstall = async () => {
        console.log('🚀 Install button clicked');

        if (deferredPrompt) {
            // WE HAVE THE REAL PROMPT!
            try {
                console.log('✨ Using REAL install prompt');
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log('Real install result:', outcome);

                if (outcome === 'accepted') {
                    setDeferredPrompt(null);
                    setShowInstallButton(false);
                    setIsInstalled(true);
                }
            } catch (error) {
                console.error('Real install error:', error);
            }
        } else {
            // Show instructions as fallback
            showInstallInstructions();
        }
    };

    const showInstallInstructions = () => {
        const userAgent = navigator.userAgent.toLowerCase();
        let instructions = '';

        if (userAgent.includes('chrome')) {
            instructions = 'Chrome: Menu (⋮) → "Add to Home Screen"';
        } else if (userAgent.includes('safari')) {
            instructions = 'Safari: Share (⬆) → "Add to Home Screen"';
        } else {
            instructions = 'Look for "Add to Home Screen" in browser menu';
        }

        alert(`Install this app:\n\n${instructions}\n\nTip: Visit this page a few more times to unlock automatic install!`);
    };

    // Force another visit to trigger prompt faster
    const forceSecondVisit = () => {
        localStorage.setItem('pwa-visit-count', '2');
        window.location.reload();
    };

    // Your existing component functions...
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
    const visitCount = parseInt(localStorage.getItem('pwa-visit-count') || '0');

    return (
        <div className="min-h-screen bg-white">
            {/* Install Banner */}
            {!isInstalled && showInstallButton && (
                <div className="bg-blue-600 text-white px-4 py-2 text-center text-sm">
                    <span className="mr-2">
                        {deferredPrompt ? '🎉 Ready to install!' : '📱 Install this app!'}
                    </span>
                    <button
                        onClick={handleInstall}
                        className="bg-white text-blue-600 px-3 py-1 rounded text-xs font-medium hover:bg-blue-50 transition-colors"
                    >
                        {deferredPrompt ? 'Install Now (Real)' : 'Install Now'}
                    </button>
                </div>
            )}

            {/* Engagement Status Debug */}
            <div className="bg-yellow-100 text-yellow-800 px-4 py-1 text-xs">
                <strong>Real Prompt Status:</strong> {engagementStatus || 'Starting engagement...'} |
                <strong> Has Real Prompt:</strong> {deferredPrompt ? '✅ YES' : '❌ NO'} |
                <strong> Visits:</strong> {visitCount}
                {visitCount < 2 && (
                    <button
                        onClick={forceSecondVisit}
                        className="ml-2 bg-yellow-600 text-white px-2 py-0.5 rounded text-xs"
                    >
                        Force 2nd Visit
                    </button>
                )}
            </div>

            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Film className="w-5 h-5 text-blue-600" />
                            <h1 className="text-lg font-medium text-gray-900">
                                {selectionMode ? `${selectedCount} selected` : 'Omar Log'}
                            </h1>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Install button in header */}
                            {!isInstalled && showInstallButton && (
                                <button
                                    onClick={handleInstall}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                        deferredPrompt
                                            ? 'bg-green-600 text-white hover:bg-green-700'
                                            : 'bg-orange-600 text-white hover:bg-orange-700'
                                    }`}
                                >
                                    <Download className="w-3 h-3" />
                                    {deferredPrompt ? 'Real Install' : 'Install'}
                                </button>
                            )}

                            {selectionMode ? (
                                <button
                                    onClick={exitSelectionMode}
                                    className="bg-gray-100 active:bg-gray-200 text-gray-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleAddRecord}
                                    className="bg-blue-600 active:bg-blue-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Rest of your app stays exactly the same */}
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

            <div className={`px-4 ${logs.length > 0 ? 'pb-20' : 'pb-4'}`}>
                <LogDisplay
                    logs={logs}
                    onEditRecord={handleEditRecord}
                    selectionMode={selectionMode}
                    selectedLogs={selectedLogs}
                    onToggleSelection={toggleLogSelection}
                />

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

            {logs.length > 0 && !selectionMode && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3">
                    <div className="flex justify-center gap-3">
                        <button
                            onClick={enterSelectionMode}
                            className="bg-gray-50 active:bg-gray-100 text-gray-700 px-4 py-2.5 rounded-full text-sm font-medium transition-colors"
                        >
                            Select logs
                        </button>
                        <button
                            onClick={() => {
                                enterSelectionMode();
                                selectAllLogs();
                            }}
                            className="bg-blue-50 active:bg-blue-100 text-blue-700 px-6 py-2.5 rounded-full flex items-center gap-2 text-sm font-medium transition-colors"
                        >
                            <Share2 className="w-4 h-4" />
                            Share all {logs.length}
                        </button>
                    </div>
                </div>
            )}

            {selectionMode && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3">
                    <div className="flex justify-center">
                        <ExportButton
                            logs={selectionMode
                                ? logs.filter(log => selectedLogs.has(log.id))
                                : logs}
                            className={`px-6 py-2.5 rounded-full flex items-center gap-2 text-sm font-medium transition-colors ${
                                selectedCount > 0
                                    ? 'bg-blue-600 active:bg-blue-700 text-white'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                        />
                    </div>
                </div>
            )}

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