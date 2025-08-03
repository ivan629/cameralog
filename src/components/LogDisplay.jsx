import {Camera} from "lucide-react";

export const LogDisplay = ({ logs, onEditRecord }) => {
    if (logs.length === 0) return null;

    return (
        <div className="py-4 space-y-3">
            {logs.map((log) => (
                <div
                    key={log.id}
                    onClick={() => onEditRecord(log)}
                    className="bg-white border border-gray-200 rounded-lg p-4 active:bg-gray-50 transition-colors cursor-pointer"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-gray-900">
                                    Scene {log.scene} - Take {log.take}
                                </span>
                                {log.circled && (
                                    <span className="text-green-600 text-xs">⭕</span>
                                )}
                            </div>

                            <div className="text-xs text-gray-500 space-y-1">
                                <div>Camera {log.camera} {log.lens && `• ${log.lens}`}</div>
                                <div>{log.timecode}</div>
                                {log.notes && (
                                    <div className="text-gray-600 mt-2 text-sm line-clamp-2">
                                        {log.notes}
                                    </div>
                                )}
                            </div>
                        </div>

                        <Camera className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
                    </div>
                </div>
            ))}
        </div>
    );
};