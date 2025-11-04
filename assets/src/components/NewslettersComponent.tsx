import React, { useEffect, useState } from 'react';
import { EmailTemplatesComponent } from './newsletters/EmailTemplatesComponent';

export const NewslettersComponent: React.FC = () => {
  const [subroute, setSubroute] = useState<string>(() => (location.hash.substring(1) || 'newsletters'));

  useEffect(() => {
    const onHash = () => setSubroute(location.hash.substring(1) || 'newsletters');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (subroute.startsWith('newsletters/templates')) {
    return <EmailTemplatesComponent />;
  }

  // Simple landing for Newsletters
  return (
    <div className="p-4">
      <div className="bg-white/80 border border-gray-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Newsletters</h2>
        <p className="text-gray-700 mb-4">Manage your email assets.</p>
        <ul className="list-disc list-inside text-gray-800">
          <li>
            <a className="text-indigo-700 hover:underline" href="#newsletters/templates">Email templates</a>
          </li>
          <li className="text-gray-400">Campaigns (coming soon)</li>
        </ul>
      </div>
    </div>
  );
};
