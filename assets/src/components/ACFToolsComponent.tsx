import React from 'react';

export const ACFToolsComponent: React.FC = () => {
    return (
        <div className="w-full">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Advanced Custom Fields</h3>
                <p className="text-sm text-gray-600">Native in‑SPA tools are coming soon. Below are placeholders to show the intended layout.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-5xl">
                <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Field Groups</h4>
                    <p className="text-xs text-gray-600 mb-3">List, search, create, and edit field groups.</p>
                    <div className="space-y-2">
                        <div className="h-8 bg-gray-100 rounded" />
                        <div className="h-8 bg-gray-100 rounded" />
                        <div className="h-8 bg-gray-100 rounded" />
                    </div>
                    <div className="mt-3 flex gap-2">
                        <button className="inline-flex items-center px-2.5 py-1.5 rounded border border-gray-300 text-xs text-gray-700" disabled>New Group</button>
                        <button className="inline-flex items-center px-2.5 py-1.5 rounded border border-gray-300 text-xs text-gray-700" disabled>Import</button>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Fields Explorer</h4>
                    <p className="text-xs text-gray-600 mb-3">Browse fields by post type/taxonomy.</p>
                    <div className="space-y-2">
                        <div className="h-6 bg-gray-100 rounded" />
                        <div className="h-6 bg-gray-100 rounded" />
                        <div className="h-6 bg-gray-100 rounded" />
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 md:col-span-2">
                    <p className="text-xs text-gray-600">Skeleton only. No external links. Full CRUD will be implemented inside the SPA.</p>
                </div>
            </div>
        </div>
    );
};
