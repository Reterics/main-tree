import React from 'react';
import { adminUrl } from '../utils/wp';
import { ExternalLinkButton } from './ExternalLinkButton';

export const CodeSnippetsComponent: React.FC = () => (
    <div className="w-full">
        <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Code Snippets</h3>
            <p className="text-sm text-gray-600">Manage custom PHP snippets safely.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">
            <div className="bg-white/80 border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6">
                <h4 className="text-md font-medium text-gray-900 mb-2">Snippets</h4>
                <p className="text-sm text-gray-600 mb-4">Browse all snippets or add a new one.</p>
                <div className="flex gap-3">
                    <ExternalLinkButton href={adminUrl('admin.php?page=snippets')}>All Snippets</ExternalLinkButton>
                    <ExternalLinkButton href={adminUrl('admin.php?page=snippets&action=add')} className="bg-slate-600 hover:bg-slate-700">Add New</ExternalLinkButton>
                </div>
            </div>
        </div>
        <div className="bg-white/60 border border-gray-200 rounded-lg p-4 sm:p-6 mt-4 max-w-5xl">
            <p className="text-sm text-gray-600">If the plugin is inactive/not installed, these links may not work.</p>
        </div>
    </div>
);
