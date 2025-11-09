import React, { useState, useMemo } from 'react';
import { TargetIcon, ZapIcon } from './Icons';
import type { FlowRecord } from '../types';

interface FlowScoreProps {
  history: FlowRecord[];
  completedCycles: number;
}

type View = 'Today' | 'Week';

// Helper function to get the start of a day
const getStartOfDay = (date: Date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
};

const Chart = ({ data }: { data: { label: string; value: number }[] }) => {
    const maxValue = Math.max(...data.map(d => d.value), 25); // Set a minimum max value for better visualization
    const chartHeight = 80;
    
    if (data.every(d => d.value === 0)) {
        return <div className="flex items-center justify-center h-24 mt-4 bg-white/5 p-2 rounded-lg text-sm text-white/50">No activity to show for this period.</div>
    }

    return (
        <div className="flex items-end justify-around h-24 mt-4 bg-white/5 p-2 rounded-lg">
            {data.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1 w-10 text-center">
                    <div className="relative w-full h-full flex items-end justify-center group">
                         <div
                            className="w-4 bg-purple-400 rounded-t-sm transition-all duration-500 ease-out group-hover:bg-purple-300"
                            style={{ height: `${(d.value / maxValue) * chartHeight}px` }}
                         ></div>
                         <span className="absolute -top-5 text-xs bg-black/50 text-white/80 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {d.value}
                         </span>
                    </div>
                    <span className="text-xs text-white/60">{d.label}</span>
                </div>
            ))}
        </div>
    );
};


export const FlowScore: React.FC<FlowScoreProps> = ({ history, completedCycles }) => {
    const [view, setView] = useState<View>('Week');

    const totalScore = useMemo(() => history.reduce((sum, r) => sum + r.score, 0), [history]);

    const chartData = useMemo(() => {
        const now = new Date();
        if (view === 'Today') {
            const today = getStartOfDay(now);
            const hourlyData = Array(6).fill(0); // 4-hour chunks for 24h: 0-3, 4-7, 8-11, 12-15, 16-19, 20-23
            history
                .filter(r => r.timestamp >= today.getTime())
                .forEach(r => {
                    const hour = new Date(r.timestamp).getHours();
                    const chunk = Math.floor(hour / 4);
                    hourlyData[chunk] += r.score;
                });
            return hourlyData.map((score, i) => ({ label: `${i*4}h`, value: score }));
        }
        if (view === 'Week') {
            const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const startOfWeek = getStartOfDay(now);
            startOfWeek.setDate(startOfWeek.getDate() - now.getDay());
            
            const weeklyData = Array(7).fill(0);
            
            history
                .filter(r => r.timestamp >= startOfWeek.getTime())
                .forEach(r => {
                    const dayIndex = new Date(r.timestamp).getDay();
                    weeklyData[dayIndex] += r.score;
                });

            // Rotate array to start from today
            const todayIndex = now.getDay();
            const rotatedLabels = [...dayLabels.slice(todayIndex + 1), ...dayLabels.slice(0, todayIndex + 1)];
            const rotatedData = [...weeklyData.slice(todayIndex + 1), ...weeklyData.slice(0, todayIndex + 1)];

            return rotatedData.map((score, i) => ({ label: rotatedLabels[i], value: score }));
        }
        return [];
    }, [history, view]);

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ZapIcon className="w-5 h-5 text-yellow-300"/>
                    <span className="font-semibold text-white/90 text-sm">Total Flow Score</span>
                </div>
                <span className="text-xl font-bold text-yellow-300">{totalScore}</span>
            </div>
            <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <TargetIcon className="w-5 h-5 text-purple-300"/>
                    <span className="font-semibold text-white/90 text-sm">Cycles Completed</span>
                </div>
                <span className="text-xl font-bold text-purple-300">{completedCycles}</span>
            </div>

            <div>
                <div className="flex justify-between items-center mt-3">
                    <h3 className="text-sm font-semibold text-white/70">Flow History</h3>
                    <div className="flex p-1 bg-white/10 rounded-full text-xs">
                        <button onClick={() => setView('Today')} className={`px-3 py-1 rounded-full transition-colors ${view === 'Today' ? 'bg-white/20' : ''}`}>Today</button>
                        <button onClick={() => setView('Week')} className={`px-3 py-1 rounded-full transition-colors ${view === 'Week' ? 'bg-white/20' : ''}`}>Week</button>
                    </div>
                </div>
                <Chart data={chartData} />
            </div>
        </div>
    );
};