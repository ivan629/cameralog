import { Camera, Clock, Calendar, Check } from "lucide-react";

// Helper function to format dates in a user-friendly way
const formatLogDate = (dateString) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    // If invalid date
    if (isNaN(date.getTime())) return null;

    // Less than 1 hour ago
    if (diffInHours < 1) {
        const minutes = Math.floor(diffInMs / (1000 * 60));
        return minutes <= 1 ? 'Just now' : `${minutes}m ago`;
    }

    // Less than 24 hours ago
    if (diffInHours < 24) {
        const hours = Math.floor(diffInHours);
        return `${hours}h ago`;
    }

    // Less than 7 days ago
    if (diffInDays < 7) {
        const days = Math.floor(diffInDays);
        return `${days}d ago`;
    }

    // Same year
    if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    }

    // Different year
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

// Helper function to get full date for tooltips
const getFullDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    return date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Helper function to extract time from timestamp or timecode
const getTimeInfo = (log) => {
    // Priority: timestamp > timecode > createdAt
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

    if (log.timecode) {
        return log.timecode;
    }

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

    return null;
};

export const LogDisplay = ({
                               logs,
                               onEditRecord,
                               selectionMode = false,
                               selectedLogs = new Set(),
                               onToggleSelection = () => {}
                           }) => {
    if (logs.length === 0) return null;

    const handleLogClick = (log) => {
        if (selectionMode) {
            onToggleSelection(log.id);
        } else {
            onEditRecord(log);
        }
    };

    return (
        <div className="py-4 space-y-3">
            {logs.map((log) => {
                const relativeDate = formatLogDate(log.createdAt || log.timestamp);
                const fullDate = getFullDate(log.createdAt || log.timestamp);
                const timeInfo = getTimeInfo(log);
                const isSelected = selectedLogs.has(log.id);

                return (
                    <div
                        key={log.id}
                        onClick={() => handleLogClick(log)}
                        className={`bg-white border rounded-lg p-4 active:bg-gray-50 transition-colors cursor-pointer hover:shadow-md ${
                            selectionMode
                                ? isSelected
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200'
                                : 'border-gray-200'
                        }`}
                    >
                        <div className="flex items-start justify-between">
                            {/* Selection Checkbox */}
                            {selectionMode && (
                                <div className="mr-3 mt-1">
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                        isSelected
                                            ? 'bg-blue-600 border-blue-600'
                                            : 'border-gray-300 bg-white'
                                    }`}>
                                        {isSelected && (
                                            <Check className="w-3 h-3 text-white" />
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex-1">
                                {/* Header with Scene/Take and Date */}
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-900">
                                            Scene {log.scene || 'NA'} - Take {log.take || '—'}
                                        </span>
                                        {log.circled && (
                                            <span className="text-green-600 text-xs">⭕</span>
                                        )}
                                    </div>

                                    {/* Date Information */}
                                    {relativeDate && (
                                        <div
                                            className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md"
                                            title={fullDate}
                                        >
                                            <Calendar className="w-3 h-3" />
                                            {relativeDate}
                                        </div>
                                    )}
                                </div>

                                {/* Camera and Equipment Info */}
                                <div className="text-xs text-gray-500 space-y-1">
                                    <div className="flex items-center gap-1">
                                        <Camera className="w-3 h-3" />
                                        {log.camera || 'No camera'}
                                        {log.lens && ` • ${log.lens}`}
                                        {log.fStop && ` • ${log.fStop}`}
                                    </div>

                                    {/* Time Information */}
                                    {timeInfo && (
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {timeInfo}
                                            {log.iso && ` • ISO ${log.iso}`}
                                        </div>
                                    )}
                                </div>

                                {/* Notes */}
                                {log.notes && (
                                    <div className="text-gray-600 mt-2 text-sm line-clamp-2">
                                        {log.notes}
                                    </div>
                                )}
                            </div>

                            {/* Status Indicator */}
                            <div className="ml-3 flex flex-col items-end gap-2">
                                {/* Roll indicator */}
                                {log.roll && (
                                    <div className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded-md">
                                        Roll {log.roll}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
