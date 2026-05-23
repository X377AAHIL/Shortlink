import { getClicksTimeseries, getDevicesData } from '@/lib/analytics';
import ClicksChart from '@/components/ClicksChart';
import DevicesChart from '@/components/DevicesChart';
import { BarChart3 } from 'lucide-react';

export default async function AnalyticsPage(
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  // Fetch data from Tinybird in parallel
  const [timeseries, devices] = await Promise.all([
    getClicksTimeseries(code),
    getDevicesData(code)
  ]);

  return (
    <main className="min-h-screen bg-neutral-950 p-6 sm:p-10 selection:bg-purple-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/15 via-neutral-950 to-neutral-950 -z-10" />
      
      <div className="max-w-6xl mx-auto mt-8">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-2xl border border-purple-500/30">
                <BarChart3 className="text-purple-400" size={36} />
              </div>
              Analytics
            </h1>
            <p className="text-gray-400 mt-4 text-lg">
              Viewing insights for <span className="font-mono text-white bg-white/10 px-3 py-1 rounded-md ml-1 border border-white/10">/{code}</span>
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ClicksChart data={timeseries} />
          </div>
          <div className="lg:col-span-1">
            <DevicesChart data={devices} />
          </div>
        </div>
      </div>
    </main>
  );
}
