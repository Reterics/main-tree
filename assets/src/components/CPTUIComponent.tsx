import React from 'react';

export const CPTUIComponent: React.FC = () => (
    <div className="w-full">
        <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Custom Post Type UI</h3>
            <p className="text-sm text-gray-600">Native in‑SPA CPT and Taxonomy management is coming soon. This is a skeleton layout showing the intended structure.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-5xl">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Post Types</h4>
                <p className="text-xs text-gray-600 mb-3">Create and edit custom post types.</p>
                <div className="space-y-2">
                    <div className="h-8 bg-gray-100 rounded" />
                    <div className="h-8 bg-gray-100 rounded" />
                    <div className="h-8 bg-gray-100 rounded" />
                </div>
                <div className="mt-3 flex gap-2">
                    <button className="inline-flex items-center px-2.5 py-1.5 rounded border border-gray-300 text-xs text-gray-700" disabled>Add New</button>
                    <button className="inline-flex items-center px-2.5 py-1.5 rounded border border-gray-300 text-xs text-gray-700" disabled>Import</button>
                </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Taxonomies</h4>
                <p className="text-xs text-gray-600 mb-3">Create and edit custom taxonomies.</p>
                <div className="space-y-2">
                    <div className="h-8 bg-gray-100 rounded" />
                    <div className="h-8 bg-gray-100 rounded" />
                    <div className="h-8 bg-gray-100 rounded" />
                </div>
                <div className="mt-3 flex gap-2">
                    <button className="inline-flex items-center px-2.5 py-1.5 rounded border border-gray-300 text-xs text-gray-700" disabled>Add New</button>
                    <button className="inline-flex items-center px-2.5 py-1.5 rounded border border-gray-300 text-xs text-gray-700" disabled>Import</button>
                </div>
            </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 mt-3 max-w-5xl">
            <p className="text-xs text-gray-600">Skeleton only. No external links. Full CRUD will be implemented inside the SPA.</p>
        </div>
    </div>
);
