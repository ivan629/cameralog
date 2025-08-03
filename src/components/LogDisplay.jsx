import { Camera, Clock, Calendar } from "lucide-react";

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

export const LogDisplay = ({ logs, onEditRecord }) => {
    if (logs.length === 0) return null;

    return (
        <div className="py-4 space-y-3">
            {logs.map((log) => {
                const relativeDate = formatLogDate(log.createdAt || log.timestamp);
                const fullDate = getFullDate(log.createdAt || log.timestamp);
                const timeInfo = getTimeInfo(log);

                return (
                    <div
                        key={log.id}
                        onClick={() => onEditRecord(log)}
                        className="bg-white border border-gray-200 rounded-lg p-4 active:bg-gray-50 transition-colors cursor-pointer hover:shadow-md"
                    >
                        <div className="flex items-start justify-between">
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

// Alternative: Compact version with date prominently displayed
export const CompactLogDisplay = ({ logs, onEditRecord }) => {
    if (logs.length === 0) return null;

    // Group logs by date
    const groupedLogs = logs.reduce((groups, log) => {
        const date = log.createdAt || log.timestamp;
        const dateKey = date ? new Date(date).toDateString() : 'Unknown Date';

        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(log);
        return groups;
    }, {});

    return (
        <div className="py-4 space-y-6">
            {Object.entries(groupedLogs).map(([dateKey, logsForDate]) => (
                <div key={dateKey}>
                    {/* Date Header */}
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <h3 className="text-sm font-medium text-gray-700">
                            {dateKey === new Date().toDateString() ? 'Today' :
                                dateKey === new Date(Date.now() - 86400000).toDateString() ? 'Yesterday' :
                                    dateKey !== 'Unknown Date' ? new Date(dateKey).toLocaleDateString('en-US', {
                                        weekday: 'long', month: 'long', day: 'numeric'
                                    }) : 'Unknown Date'}
                        </h3>
                        <span className="text-xs text-gray-500">
                            {logsForDate.length} log{logsForDate.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {/* Logs for this date */}
                    <div className="space-y-2">
                        {logsForDate.map((log) => {
                            const timeInfo = getTimeInfo(log);

                            return (
                                <div
                                    key={log.id}
                                    onClick={() => onEditRecord(log)}
                                    className="bg-white border border-gray-200 rounded-lg p-3 active:bg-gray-50 transition-colors cursor-pointer hover:shadow-sm"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-medium text-gray-900">
                                                    S{log.scene || '?'}-T{log.take || '?'}
                                                </span>
                                                {log.circled && (
                                                    <span className="text-green-600 text-xs">⭕</span>
                                                )}
                                                {timeInfo && (
                                                    <span className="text-xs text-gray-500">
                                                        {timeInfo}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="text-xs text-gray-500">
                                                {log.camera || 'No camera'}
                                                {log.lens && ` • ${log.lens}`}
                                                {log.roll && ` • Roll ${log.roll}`}
                                            </div>
                                        </div>

                                        <Camera className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};
