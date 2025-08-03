import React, { useState } from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { Download, FileText, Check, X, Share2 } from "lucide-react";

// Simple PDF styles
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 11,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        textAlign: 'center',
        paddingBottom: 10,
        borderBottom: '2px solid #000000',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 12,
        color: '#666666',
        marginBottom: 10,
    },
    metadata: {
        fontSize: 9,
        color: '#888888',
    },
    logEntry: {
        border: '1px solid #CCCCCC',
        marginBottom: 10,
        padding: 12,
    },
    logHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        paddingBottom: 5,
        borderBottom: '1px solid #EEEEEE',
    },
    sceneInfo: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    timeInfo: {
        fontSize: 10,
        color: '#666666',
    },
    details: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
    },
    detailColumn: {
        flex: 1,
        minWidth: 120,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    label: {
        width: 70,
        fontSize: 10,
        fontWeight: 'bold',
        color: '#333333',
    },
    value: {
        fontSize: 10,
        flex: 1,
    },
    notes: {
        marginTop: 8,
        paddingTop: 8,
        borderTop: '1px solid #EEEEEE',
    },
    notesLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    notesText: {
        fontSize: 9,
        lineHeight: 1.3,
    },
    circledBadge: {
        backgroundColor: '#10B981',
        color: 'white',
        padding: '2 6',
        borderRadius: 3,
        fontSize: 8,
        marginLeft: 10,
    },
});

// Simple PDF Document
const SimpleCameraLogDocument = ({ logs }) => {
    const formatTime = (timestamp, timecode) => {
        try {
            if (timecode && timecode.toString().trim()) return timecode.toString();
            if (timestamp && timestamp.toString().trim()) {
                const date = new Date(timestamp);
                if (!isNaN(date.getTime())) {
                    return date.toLocaleTimeString('en-US', { hour12: false });
                }
            }
            return '';
        } catch (e) {
            return '';
        }
    };

    const formatDate = (dateStr) => {
        try {
            if (!dateStr || !dateStr.toString().trim()) return '';
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return '';
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            return '';
        }
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Camera Log Report</Text>
                    <Text style={styles.subtitle}>Production Logs</Text>
                    <Text style={styles.metadata}>
                        Generated on {new Date().toLocaleDateString()} | Total Logs: {logs.length} |
                        Circled Takes: {logs.filter(log => log.circled).length}
                    </Text>
                </View>

                {/* Log Entries */}
                {logs.map((log, index) => (
                    <View key={log.id || index} style={styles.logEntry}>
                        {/* Log Header */}
                        <View style={styles.logHeader}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.sceneInfo}>
                                    {log.scene ? `Scene ${log.scene}` : 'Scene N/A'} -
                                    {log.take ? ` Take ${log.take}` : ' Take N/A'}
                                    {log.shot ? ` Shot ${log.shot}` : ''}
                                </Text>
                                {log.circled && (
                                    <Text style={styles.circledBadge}>CIRCLED</Text>
                                )}
                            </View>
                            <Text style={styles.timeInfo}>
                                {formatTime(log.timestamp, log.timecode)}
                                {log.createdAt && ` | ${formatDate(log.createdAt)}`}
                            </Text>
                        </View>

                        {/* Details */}
                        <View style={styles.details}>
                            <View style={styles.detailColumn}>
                                {log.camera && (
                                    <View style={styles.detailRow}>
                                        <Text style={styles.label}>Camera:</Text>
                                        <Text style={styles.value}>{log.camera}</Text>
                                    </View>
                                )}
                                {log.lens && (
                                    <View style={styles.detailRow}>
                                        <Text style={styles.label}>Lens:</Text>
                                        <Text style={styles.value}>{log.lens}</Text>
                                    </View>
                                )}
                                {log.filter && (
                                    <View style={styles.detailRow}>
                                        <Text style={styles.label}>Filter:</Text>
                                        <Text style={styles.value}>{log.filter}</Text>
                                    </View>
                                )}
                                {log.lut && (
                                    <View style={styles.detailRow}>
                                        <Text style={styles.label}>LUT:</Text>
                                        <Text style={styles.value}>{log.lut}</Text>
                                    </View>
                                )}
                                {log.roll && (
                                    <View style={styles.detailRow}>
                                        <Text style={styles.label}>Roll:</Text>
                                        <Text style={styles.value}>{log.roll}</Text>
                                    </View>
                                )}
                                {log.slate && (
                                    <View style={styles.detailRow}>
                                        <Text style={styles.label}>Slate:</Text>
                                        <Text style={styles.value}>{log.slate}</Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.detailColumn}>
                                {log.fStop && (
                                    <View style={styles.detailRow}>
                                        <Text style={styles.label}>F-Stop:</Text>
                                        <Text style={styles.value}>{log.fStop}</Text>
                                    </View>
                                )}
                                {log.shutter && (
                                    <View style={styles.detailRow}>
                                        <Text style={styles.label}>Shutter:</Text>
                                        <Text style={styles.value}>{log.shutter}</Text>
                                    </View>
                                )}
                                {log.iso && (
                                    <View style={styles.detailRow}>
                                        <Text style={styles.label}>ISO:</Text>
                                        <Text style={styles.value}>{log.iso}</Text>
                                    </View>
                                )}
                                {log.whiteBalance && (
                                    <View style={styles.detailRow}>
                                        <Text style={styles.label}>WB:</Text>
                                        <Text style={styles.value}>{log.whiteBalance}</Text>
                                    </View>
                                )}
                                {log.user && (
                                    <View style={styles.detailRow}>
                                        <Text style={styles.label}>User:</Text>
                                        <Text style={styles.value}>{log.user}</Text>
                                    </View>
                                )}
                                {log.clips && (
                                    <View style={styles.detailRow}>
                                        <Text style={styles.label}>Clips:</Text>
                                        <Text style={styles.value}>{log.clips}</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Notes */}
                        {log.notes && (
                            <View style={styles.notes}>
                                <Text style={styles.notesLabel}>Notes:</Text>
                                <Text style={styles.notesText}>{log.notes}</Text>
                            </View>
                        )}
                    </View>
                ))}
            </Page>
        </Document>
    );
};

// Simple PDF generation function with better error handling
export const generateSimplePDF = async (logs) => {
    try {
        console.log('Starting PDF generation with logs:', logs.length);

        // Validate logs data
        if (!logs || !Array.isArray(logs) || logs.length === 0) {
            throw new Error('No valid logs data provided');
        }

        // Clean logs data to prevent null/undefined issues
        const cleanLogs = logs.map(log => ({
            ...log,
            camera: log.camera || '',
            roll: log.roll || '',
            take: log.take || '',
            scene: log.scene || '',
            shot: log.shot || '',
            slate: log.slate || '',
            lens: log.lens || '',
            filter: log.filter || '',
            lut: log.lut || '',
            fStop: log.fStop || '',
            shutter: log.shutter || '',
            iso: log.iso || '',
            whiteBalance: log.whiteBalance || '',
            user: log.user || '',
            notes: log.notes || '',
            circled: Boolean(log.circled),
            clips: log.clips || '',
            timestamp: log.timestamp || '',
            timecode: log.timecode || '',
            id: log.id || Math.random().toString(),
            createdAt: log.createdAt || ''
        }));

        console.log('Cleaned logs data, generating PDF...');
        const blob = await pdf(<SimpleCameraLogDocument logs={cleanLogs} />).toBlob();
        console.log('PDF generated successfully, size:', blob.size);
        return blob;
    } catch (error) {
        console.error('PDF generation failed:', error);
        console.error('Error details:', error.message);
        throw new Error(`Failed to generate PDF: ${error.message}`);
    }
};

// PDF Actions Modal - shown after PDF is generated
const PDFActionsModal = ({ isOpen, onClose, pdfBlob }) => {
    const handleDownload = () => {
        if (pdfBlob) {
            const url = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `camera-log-${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
        onClose();
    };

    const handleShare = async () => {
        if (!pdfBlob) return;

        try {
            if (navigator.share && navigator.canShare) {
                const file = new File([pdfBlob], `camera-log-${new Date().toISOString().split('T')[0]}.pdf`, {
                    type: 'application/pdf',
                });

                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: 'Camera Log Report',
                        text: 'Camera log report from production',
                        files: [file],
                    });
                    onClose();
                    return;
                }
            }
            // Fallback to download if sharing not supported
            handleDownload();
        } catch (error) {
            console.error('PDF sharing failed:', error);
            handleDownload();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Check className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">PDF Generated!</h2>
                            <p className="text-sm text-gray-600">Your camera log report is ready</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h3 className="font-medium text-gray-900 mb-2">Camera Log Report</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p>Generated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
                            <p>File size: {pdfBlob ? Math.round(pdfBlob.size / 1024) : 0} KB</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleDownload}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Download
                        </button>

                        <button
                            onClick={handleShare}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// Simple Export Button Component
export const ExportButton = ({ logs, className = "" }) => {
    const [showActionsModal, setShowActionsModal] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [pdfBlob, setPdfBlob] = useState(null);

    const handleExport = async () => {
        setIsGenerating(true);

        try {
            const blob = await generateSimplePDF(logs);
            setPdfBlob(blob);
            setShowActionsModal(true);
        } catch (error) {
            console.error('PDF generation failed:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsGenerating(false);
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
                onClick={handleExport}
                disabled={isGenerating}
                className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors ${className}`}
            >
                <FileText className="w-4 h-4" />
                {isGenerating ? 'Generating...' : 'Export PDF'}
            </button>

            <PDFActionsModal
                isOpen={showActionsModal}
                onClose={() => {
                    setShowActionsModal(false);
                    setPdfBlob(null);
                }}
                pdfBlob={pdfBlob}
            />
        </>
    );
};