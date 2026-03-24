import React from 'react';
import { Trophy, Activity, Award, BarChart3, PieChart, Target, User as UserIcon, Users, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const InsightHub = ({ students, onShowProfile }) => {
    const latestStudents = [...students].reverse().slice(0, 5);
    const metrics = {
        total: students.length,
        pass: students.filter(s => s.status === 'PASS').length,
        supply: students.filter(s => s.status === 'SUPPLY').length,
        fail: students.filter(s => s.status === 'FAIL').length,
    };

    const deptDistribution = students.reduce((acc, curr) => {
        const deptName = curr.department?.name || 'Unknown Hub';
        acc[deptName] = (acc[deptName] || 0) + 1;
        return acc;
    }, {});

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-32 px-2"
        >
            {/* Top Grid: Real-time Performance Pulse */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Activated Registry', val: metrics.total, icon: Users, color: 'indigo', label2: 'Profiles' },
                    { label: 'Cleared Success', val: metrics.pass, icon: ShieldCheck, color: 'emerald', label2: 'PASS' },
                    { label: 'Critical Backlogs', val: metrics.supply, icon: AlertTriangle, color: 'amber', label2: 'SUPPLY' },
                    { label: 'Archive Lock', val: metrics.fail, icon: Activity, color: 'rose', label2: 'FAIL' },
                ].map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className="bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all"
                    >
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-${stat.color}-100 transition-colors`} />
                        <div className="flex flex-col relative z-10">
                            <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-8 border border-${stat.color}-100 group-hover:bg-${stat.color}-600 group-hover:text-white transition-all transform group-hover:rotate-6 shadow-sm`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">{stat.label}</span>
                            <div className="flex items-baseline gap-2">
                                <h4 className="text-4xl font-black text-slate-900 tracking-tighter italic">{stat.val}</h4>
                                <span className={`text-[10px] font-black text-${stat.color}-500 uppercase`}>{stat.label2}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Profile Stream: Recent Activity */}
                <div className="lg:col-span-7 bg-slate-900 p-12 rounded-[4.5rem] shadow-2xl relative overflow-hidden flex flex-col min-h-[550px]">
                    <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-[12rem] translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-12 pb-6 border-b border-white/5">
                            <div className="flex flex-col">
                                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none flex items-center gap-4">
                                    <Zap className="text-indigo-400" size={24} /> Registry Stream
                                </h3>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2 ml-10">Real-time profile ingestion diagnostics</p>
                            </div>
                            <div className="bg-indigo-600 px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white animate-pulse shadow-xl shadow-indigo-600/30">Live Update</div>
                        </div>

                        <div className="space-y-4 flex-1 overflow-y-auto scrollbar-hide pr-2">
                            {latestStudents.map((student, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => onShowProfile(student)}
                                    className="bg-white/5 border border-white/5 p-6 rounded-[2.5rem] flex items-center justify-between hover:bg-white/10 hover:border-indigo-500/20 transition-all cursor-pointer group/item"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-black group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-white tracking-widest uppercase group-hover/item:text-indigo-400 transition-colors">{student.name}</span>
                                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mt-1">{student.student_id} | {student.department?.name}</span>
                                        </div>
                                    </div>
                                    <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border shadow-lg ${student.status === 'PASS' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            student.status === 'SUPPLY' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                        }`}>
                                        {student.status}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Performance Analytics: Departmental Distribution */}
                <div className="lg:col-span-5 flex flex-col gap-10">
                    <div className="bg-white p-12 rounded-[4.5rem] shadow-sm border border-slate-50 flex-1 relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-12 pb-6 border-b border-slate-50">
                            <div className="flex flex-col">
                                <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Hub Distribution</h3>
                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-2">Departmental Load Balancing</p>
                            </div>
                            <BarChart3 size={24} className="text-slate-200" />
                        </div>

                        <div className="space-y-8 overflow-y-auto max-h-[400px] scrollbar-hide pr-2">
                            {Object.entries(deptDistribution).map(([dept, count], i) => (
                                <div key={i} className="flex flex-col gap-3 group/dept">
                                    <div className="flex items-center justify-between px-2">
                                        <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{dept} Hub</span>
                                        <span className="text-[11px] font-black text-indigo-600 italic uppercase">{count} Records</span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-50 rounded-full border border-slate-100 overflow-hidden shadow-inner">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(count / metrics.total) * 100}%` }}
                                            className="h-full bg-slate-900 group-hover/dept:bg-indigo-600 transition-colors"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-indigo-600 p-10 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group flex items-center justify-between">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="flex flex-col relative z-10">
                            <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.4em] mb-2 leading-none">Global Accuracy Hub</span>
                            <h4 className="text-3xl font-black tracking-tighter italic uppercase leading-none">Verified Stream</h4>
                        </div>
                        <Activity size={36} className="text-indigo-300 opacity-30 group-hover:rotate-12 transition-transform" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default InsightHub;
