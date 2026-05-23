'use client';

import { TimeseriesData } from '@/lib/analytics';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ClicksChartProps {
  data: TimeseriesData[];
}

export default function ClicksChart({ data }: ClicksChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 bg-white/5 border border-white/10 rounded-2xl p-4 shadow-xl backdrop-blur-md flex items-center justify-center text-gray-500">
        No timeseries data available yet.
      </div>
    );
  }

  return (
    <div className="w-full h-80 bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      <h3 className="text-lg font-semibold text-white mb-6">Clicks Over Time</h3>
      <div className="w-full h-[calc(100%-2rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickMargin={10}
            />
            <YAxis 
              stroke="#6b7280" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              allowDecimals={false}
              tickMargin={10}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '12px' }}
              itemStyle={{ color: '#a855f7' }}
              cursor={{ stroke: '#ffffff20', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Line 
              type="monotone" 
              dataKey="clicks" 
              stroke="url(#colorClicks)" 
              strokeWidth={4} 
              dot={{ r: 4, fill: '#a855f7', strokeWidth: 2, stroke: '#18181b' }} 
              activeDot={{ r: 6, fill: '#a855f7', stroke: '#fff', strokeWidth: 2 }} 
            />
            <defs>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
