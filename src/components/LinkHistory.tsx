'use client';

import { useState, useEffect } from 'react';
import { History, X, Copy, ExternalLink, Activity } from 'lucide-react';

interface LinkItem {
  shortCode: string;
  originalUrl: string;
  createdAt: string;
}

export default function LinkHistory() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<LinkItem[]>([]);
  const [origin, setOrigin] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadHistory = () => {
    const saved = JSON.parse(localStorage.getItem('linkshor_history') || '[]');
    setHistory(saved);
  };

  useEffect(() => {
    setOrigin(window.location.origin);
    loadHistory();
    window.addEventListener('linkshor_history_updated', loadHistory);
    return () => window.removeEventListener('linkshor_history_updated', loadHistory);
  }, []);

  const copyToClipboard = (shortCode: string) => {
    navigator.clipboard.writeText(`${origin}/${shortCode}`);
    setCopiedId(shortCode);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed left-6 top-6 z-40 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full shadow-lg backdrop-blur-md transition-all group"
        title="View Past Links"
      >
        <History className="text-white w-6 h-6 group-hover:text-purple-400 transition-colors" />
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 left-0 h-full w-full max-w-md bg-neutral-900 border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-neutral-950">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="text-purple-500 w-5 h-5" />
            Your Dashboard
          </h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="p-4 bg-white/5 rounded-full">
                <History className="w-8 h-8 text-gray-500" />
              </div>
              <div>
                <p className="text-gray-300 font-medium text-lg">No links yet</p>
                <p className="text-gray-500 text-sm max-w-[200px] mt-1">Shorten a URL to see it appear in your dashboard.</p>
              </div>
            </div>
          ) : (
            history.map((item) => (
              <div key={item.shortCode} className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex justify-between items-start mb-3">
                  <a 
                    href={`${origin}/${item.shortCode}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 text-lg flex items-center gap-1.5"
                  >
                    /{item.shortCode}
                    <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                  <button 
                    onClick={() => copyToClipboard(item.shortCode)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/10 rounded-lg hover:bg-white/20 text-gray-300 transition-colors text-xs font-medium"
                  >
                    {copiedId === item.shortCode ? (
                      <span className="text-green-400">Copied!</span>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                
                <p className="text-gray-400 text-sm truncate" title={item.originalUrl}>
                  {item.originalUrl}
                </p>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                  <p className="text-xs text-gray-500 font-medium">
                    {new Date(item.createdAt).toLocaleDateString(undefined, { 
                      month: 'short', day: 'numeric', year: 'numeric' 
                    })}
                  </p>
                  <a 
                    href={`/analytics/${item.shortCode}`} 
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors text-xs font-medium"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    Analytics
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
