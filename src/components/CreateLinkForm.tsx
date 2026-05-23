'use client';

import { useActionState, useEffect, useState, useRef } from 'react';
import { createLink, CreateLinkState } from '@/app/actions/createLink';
import { Copy, Check } from 'lucide-react';

const initialState: CreateLinkState = {
  success: false,
};

export default function CreateLinkForm() {
  const [state, formAction, isPending] = useActionState(createLink, initialState);
  const [origin, setOrigin] = useState('');
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Get the base URL dynamically for the success state UI
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // Handle successful submission
  useEffect(() => {
    if (state.success && state.shortCode && state.originalUrl) {
      formRef.current?.reset();
      
      const history = JSON.parse(localStorage.getItem('linkshor_history') || '[]');
      if (!history.find((item: any) => item.shortCode === state.shortCode)) {
        history.unshift({
          shortCode: state.shortCode,
          originalUrl: state.originalUrl,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('linkshor_history', JSON.stringify(history));
        window.dispatchEvent(new Event('linkshor_history_updated'));
      }
    }
  }, [state.success, state.shortCode, state.originalUrl]);

  return (
    <div className="w-full max-w-md p-8 bg-white/5 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl">
      <h2 className="text-2xl font-semibold text-white mb-6 text-center">Shorten Your Link</h2>
      
      <form ref={formRef} action={formAction} className="flex flex-col gap-5">
        <div>
          <label htmlFor="original_url" className="sr-only">Original URL</label>
          <input
            type="url"
            id="original_url"
            name="original_url"
            required
            placeholder="https://example.com/very/long/url"
            className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            disabled={isPending}
          />
        </div>
        
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
        >
          {isPending ? (
            <span className="flex items-center gap-3">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Shortening...
            </span>
          ) : (
            'Shorten Link'
          )}
        </button>
      </form>

      {state.message && !state.success && (
        <div className="mt-5 p-4 bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-xl text-center">
          {state.message}
        </div>
      )}

      {state.success && state.shortCode && (
        <div className="mt-8 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-center flex flex-col items-center space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <p className="text-gray-400 text-sm font-medium">Your short link is ready!</p>
          <div className="flex items-center justify-center gap-3 bg-black/40 py-3 px-5 rounded-xl border border-white/10 w-full">
            <a
              href={`${origin}/${state.shortCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-300 hover:opacity-80 transition-opacity truncate"
            >
              {origin}/{state.shortCode}
            </a>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(`${origin}/${state.shortCode}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="ml-auto p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-white"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
