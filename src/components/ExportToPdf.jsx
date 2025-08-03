import React, { useState } from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { Download,  FileText, Check, X } from "lucide-react";

// React-PDF Styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontSize: 10,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        paddingBottom: 15,
        borderBottom: 2,
        borderBottomColor: '#000000',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666666',
        marginBottom: 10,
    },
    metadata: {
        fontSize: 9,
        textAlign: 'center',
        color: '#888888',
        lineHeight: 1.3,
    },
    dateSection: {
        marginBottom: 20,
    },
    dateHeader: {
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: '#F3F4F6',
        padding: 8,
        marginBottom: 10,
        borderRadius: 4,
    },
    logEntry: {
        border: 1,
        borderColor: '#E5E7EB',
        borderRadius: 6,
        padding: 12,
        marginBottom: 12,
        backgroundColor: '#FAFAFA',
    },
    logHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingBottom: 6,
        borderBottom: 1,
        borderBottomColor: '#E5E7EB',
    },
    sceneTake: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    circledBadge: {
        backgroundColor: '#10B981',
        color: 'white',
        padding: '2 6',
        borderRadius: 8,
        fontSize: 8,
        fontWeight: 'bold',
        marginLeft: 6,
    },
    timeInfo: {
        fontSize: 9,
        color: '#6B7280',
        fontFamily: 'Courier',
    },
    detailsContainer: {
        flexDirection: 'row',
        gap: 20,
    },
    detailSection: {
        flex: 1,
        gap: 3,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 1,
    },
    detailLabel: {
        fontWeight: 'bold',
        color: '#374151',
        width: 60,
    },
    detailValue: {
        color: '#000000',
        fontFamily: 'Courier',
        flex: 1,
        textAlign: 'right',
    },
    notesSection: {
        marginTop: 8,
        paddingTop: 8,
        borderTop: 1,
        borderTopColor: '#E5E7EB',
    },
    notesLabel: {
        fontWeight: 'bold',
        fontSize: 9,
        marginBottom: 4,
        color: '#374151',
    },
    notesContent: {
        fontSize: 9,
        lineHeight: 1.4,
        backgroundColor: '#FFFFFF',
        padding: 6,
        borderRadius: 3,
        border: 1,
        borderColor: '#E5E7EB',
    },
    summary: {
        marginTop: 20,
        padding: 12,
        backgroundColor: '#EFF6FF',
        border: 1,
        borderColor: '#3B82F6',
        borderRadius: 6,
    },
    summaryTitle: {
        fontWeight: 'bold',
        fontSize: 12,
        marginBottom: 6,
        color: '#1E40AF',
    },
    summaryGrid: {
        flexDirection: 'row',
        gap: 20,
    },
    summaryColumn: {
        flex: 1,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 8,
        bottom: 20,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: '#6B7280',
    },
});

// Helper functions
const formatLogDate = (dateString) => {
    if (!dateString) return 'Unknown Date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Unknown Date';
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const getTimeInfo = (log) => {
    if (log.timestamp) {
        const date = new Date(log.timestamp);
        if (!isNaN(date.getTime())) {
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        }
    }
    if (log.timecode) return log.timecode;
    if (log.createdAt) {
        const date = new Date(log.createdAt);
        if (!isNaN(date.getTime())) {
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        }
    }
    return '';
};

const groupLogsByDate = (logs) => {
    const grouped = logs.reduce((groups, log) => {
        const date = log.createdAt || log.timestamp;
        const dateKey = date ? formatLogDate(date) : 'Unknown Date';

        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(log);
        return groups;
    }, {});

    // Sort dates
    const sortedEntries = Object.entries(grouped).sort(([a], [b]) => {
        if (a === 'Unknown Date') return 1;
        if (b === 'Unknown Date') return -1;
        return new Date(b) - new Date(a);
    });

    return Object.fromEntries(sortedEntries);
};

// PDF Document Component
const CameraLogDocument = ({ logs, options }) => {
    const {
        title = 'Camera Log Report',
        productionName = '',
        includeNotes = true,
        includeEmptyFields = false,
        groupByDate = true,
    } = options;

    const processedLogs = groupByDate ? groupLogsByDate(logs) : { 'All Logs': logs };

    const totalLogs = logs.length;
    const circledTakes = logs.filter(log => log.circled).length;
    const cameras = [...new Set(logs.map(log => log.camera).filter(Boolean))];
    const dateRange = logs.length > 0 ? {
        start: Math.min(...logs.map(log => new Date(log.createdAt || log.timestamp || 0).getTime())),
        end: Math.max(...logs.map(log => new Date(log.createdAt || log.timestamp || 0).getTime()))
    } : null;

    const DetailRow = ({ label, value, includeEmpty = false }) => {
        if (!value && !includeEmpty) return null;
        return (
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{label}:</Text>
                <Text style={styles.detailValue}>{value || '—'}</Text>
            </View>
        );
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    {productionName && (
                        <Text style={styles.title}>{productionName}</Text>
                    )}
                    <Text style={styles.subtitle}>{title}</Text>
                    <Text style={styles.metadata}>
                        Generated on {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })} at {new Date().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                        {'\n'}
                        Total Logs: {totalLogs} | Circled Takes: {circledTakes} | Cameras: {cameras.length}
                    </Text>
                </View>

                {/* Summary */}
                <View style={styles.summary}>
                    <Text style={styles.summaryTitle}>Report Summary</Text>
                    <View style={styles.summaryGrid}>
                        <View style={styles.summaryColumn}>
                            <View style={styles.summaryRow}>
                                <Text>Total Logs:</Text>
                                <Text>{totalLogs}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text>Circled Takes:</Text>
                                <Text>{circledTakes}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text>Success Rate:</Text>
                                <Text>{totalLogs > 0 ? Math.round((circledTakes / totalLogs) * 100) : 0}%</Text>
                            </View>
                        </View>
                        <View style={styles.summaryColumn}>
                            <View style={styles.summaryRow}>
                                <Text>Cameras Used:</Text>
                                <Text>{cameras.length}</Text>
                            </View>
                            {dateRange && (
                                <>
                                    <View style={styles.summaryRow}>
                                        <Text>Date Range:</Text>
                                        <Text>{new Date(dateRange.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                                    </View>
                                    <View style={styles.summaryRow}>
                                        <Text>to:</Text>
                                        <Text>{new Date(dateRange.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                </View>

                {/* Log Entries */}
                {Object.entries(processedLogs).map(([dateKey, dateLogs]) => (
                    <View key={dateKey} style={styles.dateSection}>
                        {groupByDate && dateKey !== 'All Logs' && (
                            <Text style={styles.dateHeader}>{dateKey} ({dateLogs.length} logs)</Text>
                        )}

                        {dateLogs.map((log, index) => {
                            const timeInfo = getTimeInfo(log);

                            return (
                                <View key={log.id || index} style={styles.logEntry}>
                                    {/* Log Header */}
                                    <View style={styles.logHeader}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={styles.sceneTake}>
                                                Scene {log.scene || 'N/A'} - Take {log.take || 'N/A'}
                                            </Text>
                                            {log.circled && (
                                                <Text style={styles.circledBadge}>CIRCLED</Text>
                                            )}
                                        </View>
                                        {timeInfo && (
                                            <Text style={styles.timeInfo}>{timeInfo}</Text>
                                        )}
                                    </View>

                                    {/* Details */}
                                    <View style={styles.detailsContainer}>
                                        <View style={styles.detailSection}>
                                            <DetailRow label="Camera" value={log.camera} includeEmpty={includeEmptyFields} />
                                            <DetailRow label="Lens" value={log.lens} includeEmpty={includeEmptyFields} />
                                            <DetailRow label="Filter" value={log.filter} includeEmpty={includeEmptyFields} />
                                            <DetailRow label="LUT" value={log.lut} includeEmpty={includeEmptyFields} />
                                            <DetailRow label="Roll" value={log.roll} includeEmpty={includeEmptyFields} />
                                        </View>
                                        <View style={styles.detailSection}>
                                            <DetailRow label="F-Stop" value={log.fStop} includeEmpty={includeEmptyFields} />
                                            <DetailRow label="Shutter" value={log.shutter} includeEmpty={includeEmptyFields} />
                                            <DetailRow label="ISO" value={log.iso} includeEmpty={includeEmptyFields} />
                                            <DetailRow label="WB" value={log.whiteBalance} includeEmpty={includeEmptyFields} />
                                            <DetailRow label="User" value={log.user} includeEmpty={includeEmptyFields} />
                                        </View>
                                    </View>

                                    {/* Notes */}
                                    {includeNotes && log.notes && (
                                        <View style={styles.notesSection}>
                                            <Text style={styles.notesLabel}>Notes:</Text>
                                            <Text style={styles.notesContent}>{log.notes}</Text>
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                ))}

                {/* Page Number */}
                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                    `Page ${pageNumber} of ${totalPages}`
                )} fixed />
            </Page>
        </Document>
    );
};

// Export Options Modal Component
const ExportOptionsModal = ({ isOpen, onClose, logs, onExport }) => {
    const [selectedLogs, setSelectedLogs] = useState(new Set(logs.map(log => log.id)));
    const [options, setOptions] = useState({
        title: 'Camera Log Report',
        productionName: '',
        includeNotes: true,
        includeEmptyFields: false,
        groupByDate: true,
        format: 'pdf'
    });

    const handleSelectAll = () => {
        setSelectedLogs(new Set(logs.map(log => log.id)));
    };

    const handleDeselectAll = () => {
        setSelectedLogs(new Set());
    };

    const handleToggleLog = (logId) => {
        const newSelected = new Set(selectedLogs);
        if (newSelected.has(logId)) {
            newSelected.delete(logId);
        } else {
            newSelected.add(logId);
        }
        setSelectedLogs(newSelected);
    };

    const handleExport = () => {
        const logsToExport = logs.filter(log => selectedLogs.has(log.id));
        onExport(logsToExport, options);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Export Camera Logs</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex h-[70vh]">
                    {/* Left Side - Options */}
                    <div className="w-1/3 p-6 border-r border-gray-200 bg-gray-50">
                        <h3 className="text-lg font-medium mb-4">Export Options</h3>

                        <div className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Report Title</label>
                                <input
                                    type="text"
                                    value={options.title}
                                    onChange={(e) => setOptions(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Production Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Production Name</label>
                                <input
                                    type="text"
                                    value={options.productionName}
                                    onChange={(e) => setOptions(prev => ({ ...prev, productionName: e.target.value }))}
                                    placeholder="Optional"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Checkboxes */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={options.includeNotes}
                                        onChange={(e) => setOptions(prev => ({ ...prev, includeNotes: e.target.checked }))}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Include Notes</span>
                                </label>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={options.includeEmptyFields}
                                        onChange={(e) => setOptions(prev => ({ ...prev, includeEmptyFields: e.target.checked }))}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Include Empty Fields</span>
                                </label>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={options.groupByDate}
                                        onChange={(e) => setOptions(prev => ({ ...prev, groupByDate: e.target.checked }))}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Group by Date</span>
                                </label>
                            </div>

                            {/* Summary */}
                            <div className="pt-4 border-t border-gray-300">
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <p className="text-sm text-blue-800 font-medium">
                                        Selected: {selectedLogs.size} of {logs.length} logs
                                    </p>
                                    <p className="text-xs text-blue-600 mt-1">
                                        Circled: {logs.filter(log => selectedLogs.has(log.id) && log.circled).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Log Selection */}
                    <div className="flex-1 flex flex-col">
                        {/* Selection Controls */}
                        <div className="p-4 border-b border-gray-200 bg-white">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium">Select Logs to Export</h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleSelectAll}
                                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                    >
                                        Select All
                                    </button>
                                    <button
                                        onClick={handleDeselectAll}
                                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Deselect All
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Log List */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="space-y-2">
                                {logs.map((log) => {
                                    const isSelected = selectedLogs.has(log.id);
                                    const timeInfo = getTimeInfo(log);

                                    return (
                                        <div
                                            key={log.id}
                                            onClick={() => handleToggleLog(log.id)}
                                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                                isSelected
                                                    ? 'border-blue-300 bg-blue-50'
                                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                                    isSelected
                                                        ? 'border-blue-500 bg-blue-500'
                                                        : 'border-gray-300'
                                                }`}>
                                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">
                              Scene {log.scene || 'N/A'} - Take {log.take || 'N/A'}
                            </span>
                                                        {log.circled && (
                                                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                                Circled
                              </span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {log.camera || 'No camera'}
                                                        {timeInfo && ` • ${timeInfo}`}
                                                        {log.roll && ` • Roll ${log.roll}`}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={selectedLogs.size === 0}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Export PDF ({selectedLogs.size} logs)
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main Export Functions
export const generatePDF = async (logs, options = {}) => {
    try {
        const blob = await pdf(<CameraLogDocument logs={logs} options={options} />).toBlob();
        return blob;
    } catch (error) {
        console.error('PDF generation failed:', error);
        throw new Error('Failed to generate PDF');
    }
};

export const downloadPDF = async (logs, options = {}) => {
    try {
        const blob = await generatePDF(logs, options);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${options.title || 'camera-log'}-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('PDF download failed:', error);
        throw error;
    }
};

export const sharePDF = async (logs, options = {}) => {
    try {
        if (navigator.share && navigator.canShare) {
            const blob = await generatePDF(logs, options);
            const file = new File([blob], `${options.title || 'camera-log'}.pdf`, {
                type: 'application/pdf',
            });

            if (navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: options.title || 'Camera Log Report',
                    text: 'Camera log report generated from production',
                    files: [file],
                });
                return;
            }
        }

        // Fallback to download if sharing not supported
        await downloadPDF(logs, options);
    } catch (error) {
        console.error('PDF sharing failed:', error);
        // Fallback to download
        await downloadPDF(logs, options);
    }
};

// Export Button Component
export const ExportButton = ({ logs, className = "" }) => {
    const [showModal, setShowModal] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async (selectedLogs, options) => {
        setIsExporting(true);
        try {
            await downloadPDF(selectedLogs, options);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export PDF. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    if (logs.length === 0) {
        return (
            <button
                disabled
                className={`flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed ${className}`}
            >
                <FileText className="w-4 h-4" />
                Export PDF
            </button>
        );
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                disabled={isExporting}
                className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors ${className}`}
            >
                <FileText className="w-4 h-4" />
                {isExporting ? 'Exporting...' : 'Export PDF'}
            </button>

            <ExportOptionsModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                logs={logs}
                onExport={handleExport}
            />
        </>
    );
};
