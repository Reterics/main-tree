import React from 'react';

export const UpdatesManagerComponent: React.FC = () => (
    <div className="w-full">
        <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Updates Manager</h3>
            <p className="text-sm text-gray-600">Control update policies for core, themes, and plugins. In‑SPA management UI is coming soon.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 max-w-3xl">
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-800">Auto‑update WordPress Core</div>
                    <div className="h-5 w-10 bg-gray-100 rounded" />
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-800">Auto‑update Plugins</div>
                    <div className="h-5 w-10 bg-gray-100 rounded" />
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-800">Auto‑update Themes</div>
                    <div className="h-5 w-10 bg-gray-100 rounded" />
                </div>
            </div>
            <div className="mt-4 flex gap-2">
                <button className="inline-flex items-center px-2.5 py-1.5 rounded border border-gray-300 text-xs text-gray-700" disabled>Save Policies</button>
                <button className="inline-flex items-center px-2.5 py-1.5 rounded border border-gray-300 text-xs text-gray-700" disabled>Reset</button>
            </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 mt-3 max-w-3xl">
            <p className="text-xs text-gray-600">Skeleton only. No external links. The controls above are placeholders.</p>
        </div>
    </div>
);
