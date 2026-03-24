import React from 'react';
import { Users, TrendingUp, CheckCircle, AlertCircle, Bookmark, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

const Metrics = ({ metrics }) => {
    const statItems = [
        {
            title: "Batch Registry",
            value: metrics.total,
            desc: "Registered Students",
            icon: <Users size={22} />,
            gradient: "from-indigo-600 to-blue-500",
            shadow: "shadow-indigo-500/20",
            detail: "Capacity: 100%"
        },
        {
            title: "Class Average",
            value: metrics.avg,
            desc: "Normalized Score",
            icon: <TrendingUp size={22} />,
            gradient: "from-emerald-600 to-teal-500",
            shadow: "shadow-emerald-500/20",
            detail: "Benchmarked"
        },
        {
            title: "Passed Hub",
            value: metrics.passed,
            desc: "Verified Qualified",
            icon: <CheckCircle size={22} />,
            gradient: "from-violet-600 to-purple-500",
            shadow: "shadow-violet-500/20",
            detail: "Validated"
        },
        {
            title: "Critical Risks",
            value: metrics.failed,
            desc: "Academic Warning",
            icon: <AlertCircle size={22} />,
            gradient: "from-rose-600 to-orange-500",
            shadow: "shadow-rose-500/20",
            detail: "Needs Action"
        },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Greeting Section */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter italic">Command Hub <span className="text-indigo-600">Overview</span></h1>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Analytical Session: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-3 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white"><Compass size={20} className="animate-spin-slow" /></div>
                    <div className="flex flex-col pr-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status</span>
                        <span className="text-xs font-black text-slate-800 uppercase tracking-tighter">Systems Sync</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {statItems.map((item, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className={`bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl ${item.shadow} relative overflow-hidden group transition-all`}
                    >
                        {/* Background Decorative Element */}
                        <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${item.gradient} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`} />

                        <div className="flex flex-col relative z-10">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-lg mb-8 group-hover:rotate-6 transition-transform duration-500`}>
                                {item.icon}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{item.title}</span>
                                <div className="flex items-baseline gap-2">
                                    <h4 className="text-5xl font-black text-slate-900 tracking-tighter italic leading-none">{item.value}</h4>
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter bg-emerald-50 px-2 py-0.5 rounded-md">LIVE</span>
                                </div>
                                <p className="text-[11px] font-bold text-slate-500 mt-4 border-t border-slate-50 pt-4 flex items-center gap-2">
                                    <Bookmark size={12} className="text-indigo-400" /> {item.desc}
                                </p>
                            </div>
                        </div>

                        {/* Floating Detail Indicator */}
                        <div className="absolute top-8 right-8 text-[9px] font-black text-slate-300 uppercase tracking-widest border border-slate-100 px-3 py-1 rounded-full group-hover:border-indigo-100 group-hover:text-indigo-600 transition-colors">
                            {item.detail}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Metrics;
