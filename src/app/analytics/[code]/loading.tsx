import { Loader2 } from 'lucide-react';

export default function AnalyticsLoading() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-neutral-950 to-neutral-950 -z-10" />
      
      <div className="flex flex-col items-center p-10 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md shadow-2xl">
        <Loader2 className="h-12 w-12 text-purple-500 animate-spin mb-6" />
        <h2 className="text-2xl font-semibold text-white">Loading Analytics...</h2>
        <p className="text-gray-400 mt-2 text-center max-w-sm">
          Fetching real-time data visualizations directly from Tinybird...
        </p>
      </div>
    </div>
  );
}
