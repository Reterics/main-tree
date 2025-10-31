import React, { useState } from 'react';

export const MaintenanceModeComponent: React.FC = () => {
    const [enabled, setEnabled] = useState(false);
    return (
        <div className="w-full">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Maintenance Mode</h3>
                <p className="text-sm text-gray-600">Toggle a simple maintenance flag and preview the landing configuration (skeleton).</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 max-w-3xl">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-800">Maintenance Enabled</div>
                    <label className="inline-flex items-center gap-2 text-xs text-gray-700">
                        <input type="checkbox" checked={enabled} onChange={() => setEnabled(!enabled)} />
                        <span>{enabled ? 'On' : 'Off'}</span>
                    </label>
                </div>
                <div className="mt-4">
                    <div className="text-sm font-medium text-gray-900">Landing Message</div>
                    <div className="mt-2 h-20 bg-gray-100 rounded" />
                </div>
                <div className="mt-4 flex gap-2">
                    <button className="inline-flex items-center px-2.5 py-1.5 rounded border border-gray-300 text-xs text-gray-700" disabled>Save</button>
                    <button className="inline-flex items-center px-2.5 py-1.5 rounded border border-gray-300 text-xs text-gray-700" disabled>Preview</button>
                </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 mt-3 max-w-3xl">
                <p className="text-xs text-gray-600">Skeleton only. No external links. Actual maintenance mode integration will be implemented here.</p>
            </div>
        </div>
    );
};
