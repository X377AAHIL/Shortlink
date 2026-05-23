'use client';

import { DeviceData } from '@/lib/analytics';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DevicesChartProps {
  data: DeviceData[];
}

const COLORS = ['#8b5cf6', '#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#6366f1'];

export default function DevicesChart({ data }: DevicesChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 bg-white/5 border border-white/10 rounded-2xl p-4 shadow-xl backdrop-blur-md flex items-center justify-center text-gray-500">
        No device data available yet.
      </div>
    );
  }

  return (
    <div className="w-full h-80 bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      <h3 className="text-lg font-semibold text-white mb-2">Clicks by Device</h3>
      <div className="w-full h-[calc(100%-2rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={4}
              dataKey="clicks"
              nameKey="device"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '12px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend 
              iconType="circle" 
              wrapperStyle={{ fontSize: '13px', color: '#9ca3af' }} 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
