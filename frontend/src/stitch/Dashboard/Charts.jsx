import React from 'react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, PieChart as PieIcon, BarChart3, Activity } from 'lucide-react';

const Charts = ({ students, gradeDistribution }) => {
    // Top 10 Performers ko sort karke dikhana taaki graph saaf rahe
    const displayData = [...students]
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 10);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Performance Area/Bar Center */}
            <div className="lg:col-span-8 bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-indigo-500/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="flex items-center justify-between mb-12 relative z-10">
                    <div className="flex flex-col">
                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic border-l-8 border-indigo-600 pl-6 leading-none">Global Batch Performance Analysis</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 ml-6">Analytical breakdown of top {displayData.length} registry records</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 shadow-sm"><BarChart3 size={18} /></div>
                        <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 shadow-sm"><Activity size={18} className="animate-pulse" /></div>
                    </div>
                </div>

                <div className="h-96 relative z-10 pr-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={displayData}>
                            <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 900 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 900 }} />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                            />
                            <Bar dataKey="percentage" radius={[12, 12, 0, 0]} barSize={45}>
                                {displayData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.percentage >= 75 ? 'url(#greenGradient)' : entry.percentage >= 40 ? 'url(#indigoGradient)' : 'url(#roseGradient)'}
                                    />
                                ))}
                            </Bar>
                            <defs>
                                <linearGradient id="indigoGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="#4f46e5" />
                                </linearGradient>
                                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" />
                                    <stop offset="100%" stopColor="#059669" />
                                </linearGradient>
                                <linearGradient id="roseGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#f43f5e" />
                                    <stop offset="100%" stopColor="#e11d48" />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Grade Pie Hub */}
            <div className="lg:col-span-4 bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-indigo-500/5 overflow-hidden flex flex-col items-center group">
                <div className="flex items-center gap-4 mb-10 w-full px-4 border-b border-slate-50 pb-6">
                    <div className="bg-indigo-900 p-3 rounded-2xl shadow-xl shadow-indigo-900/10 text-white transform group-hover:rotate-12 transition-transform duration-500">
                        <PieIcon size={20} />
                    </div>
                    <h3 className="font-black text-slate-800 uppercase tracking-widest text-[11px]">Grade Distribution Matrix</h3>
                </div>

                <div className="h-72 w-full flex items-center justify-center relative">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="flex flex-col items-center">
                            <span className="text-4xl font-black text-slate-900 tracking-tighter italic leading-none">{students.length}</span>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Total Entries</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={gradeDistribution}
                                innerRadius={80}
                                outerRadius={110}
                                paddingAngle={8}
                                dataKey="count"
                                stroke="none"
                            >
                                {gradeDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} className="hover:opacity-80 transition-opacity cursor-pointer outline-none" />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-12 grid grid-cols-2 gap-4 w-full">
                    {gradeDistribution.map(g => (
                        <div key={g.name} className="flex items-center justify-between bg-slate-50/50 p-3 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full shadow-lg" style={{ backgroundColor: g.fill }} />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Grade {g.name}</span>
                            </div>
                            <span className="text-[11px] font-black text-slate-800 tracking-tighter">{g.count} Recs</span>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 p-6 shadow-2xl rounded-3xl border border-slate-800">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">{payload[0].payload.name}</p>
                <div className="flex flex-col">
                    <span className="text-3xl font-black text-white tracking-tighter italic">{payload[0].value}%</span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Acquired Success Ratio</span>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2 text-emerald-500 font-black text-[9px] uppercase tracking-widest">
                    <TrendingUp size={12} /> Registry Verified
                </div>
            </div>
        );
    }
    return null;
};

export default Charts;
