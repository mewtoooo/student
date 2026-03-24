import React from 'react';
import { Edit, Trash2, Users, Database, ShieldCheck, User as UserIcon, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentTable = ({ students, onEdit, onDelete, onShowProfile }) => {

    const getGradeStyle = (grade) => {
        switch (grade) {
            case 'A+': return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
            case 'A': return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
            case 'B': return 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20';
            case 'C': return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
            case 'F': return 'bg-rose-500/10 text-rose-500 border border-rose-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border border-slate-500/20';
        }
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Batch Control Header Section */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 rounded-2xl shadow-xl shadow-slate-900/20 text-white">
                        <Database size={22} />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic leading-none">Global Archive Registry</h3>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Verified Count: {students.length} Records</span>
                    </div>
                </div>
                <div className="bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Registry Database Synced</span>
                </div>
            </div>

            {/* Styled Grid Header */}
            <div className="hidden lg:grid grid-cols-12 gap-8 px-12 py-5 bg-white/50 backdrop-blur-3xl border border-slate-100 rounded-[2.5rem] items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] shadow-sm">
                <div className="col-span-1">Registry.ID</div>
                <div className="col-span-4">Active Profile Identity</div>
                <div className="col-span-2">Department Hub</div>
                <div className="col-span-3 text-center">Batch Performance Matrix</div>
                <div className="col-span-2 text-right">Data Security Access</div>
            </div>

            {/* Futuristic Row Entity Grid */}
            <div className="grid gap-6">
                <AnimatePresence>
                    {students.map((student, idx) => (
                        <motion.div
                            key={student.student_id}
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4, delay: idx * 0.05 }}
                            className="group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-12 py-8 bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(2,6,23,0.08)] hover:border-indigo-100 transition-all duration-500 cursor-default relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* ID Column */}
                            <div className="lg:col-span-1">
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-lg shadow-indigo-600/30" />
                                    <span className="text-[11px] font-black text-slate-900 tracking-tighter uppercase font-mono">
                                        {student.student_id}
                                    </span>
                                </div>
                            </div>

                            {/* Profile Column */}
                            <div className="lg:col-span-4 flex items-center gap-6">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-[1.75rem] bg-gradient-to-tr from-slate-900 to-indigo-800 flex items-center justify-center font-black text-white text-xl shadow-2xl group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                                        {student.name.charAt(0)}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <h5 onClick={() => onShowProfile(student)} className="text-[17px] font-black text-slate-900 tracking-tighter leading-none mb-2 hover:text-indigo-600 transition-colors cursor-pointer">{student.name}</h5>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100 shadow-sm">Roll: {student.roll_no}</span>
                                        <div className="h-1 w-1 rounded-full bg-slate-200" />
                                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 rounded-md">Archive Verified</span>
                                    </div>
                                </div>
                            </div>

                            {/* Department Column */}
                            <div className="lg:col-span-2 text-center p-3 bg-slate-50/50 rounded-2xl border border-slate-50 group-hover:bg-indigo-50/30 group-hover:border-indigo-100 transition-all">
                                <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">
                                    {student.department?.name || 'Assigned Hub'}
                                </p>
                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter italic">Identity Origin</span>
                            </div>

                            {/* Performance Column (Dynamic from Relation) */}
                            <div className="lg:col-span-3">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-900 tracking-tighter italic leading-none">{student.percentage}% SCORE</span>
                                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">Weighted Archive</span>
                                        </div>
                                        <div className={`px-4 py-2 rounded-xl text-[9px] font-black tracking-widest uppercase shadow-sm border ${student.status === 'PASS' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                            student.status === 'SUPPLY' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                                                student.status === 'FAIL' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' :
                                                    'bg-slate-500/10 text-slate-600 border-slate-500/20'
                                            }`}>
                                            {student.status} {student.grade}
                                        </div>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-50 rounded-full border border-slate-100 overflow-hidden shadow-inner">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${student.percentage}%` }}
                                            className={`h-full ${student.status === 'PASS' ? 'bg-emerald-500' : student.status === 'SUPPLY' ? 'bg-amber-500' : 'bg-rose-500'}`}
                                        />
                                    </div>
                                    {student.backlog_count > 0 && (
                                        <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest text-right flex items-center justify-end gap-1">
                                            <AlertTriangle size={10} /> {student.backlog_count} Active Backlog(s)
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Action Hub Column */}
                            <div className="lg:col-span-2 flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 translate-x-10 group-hover:translate-x-0 transition-all duration-500">
                                <button
                                    onClick={() => onShowProfile(student)}
                                    className="h-14 w-14 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-300 hover:bg-emerald-500 hover:text-white transition-all duration-300 shadow-xl shadow-slate-200/50 active:scale-90"
                                >
                                    <UserIcon size={20} />
                                </button>
                                <button
                                    onClick={() => onEdit(student)}
                                    className="h-14 w-14 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-300 hover:bg-slate-900 hover:text-white transition-all duration-300 shadow-xl shadow-slate-200/50 active:scale-90"
                                >
                                    <Edit size={20} />
                                </button>
                                <button
                                    onClick={() => onDelete(student.id)}
                                    className="h-14 w-14 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-300 hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-xl shadow-slate-200/50 active:scale-90"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {students.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-32 text-center border-4 border-dashed border-slate-100 rounded-[4rem] bg-white/50 flex flex-col items-center gap-8"
                    >
                        <div className="w-28 h-28 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-100 animate-pulse">
                            <Users size={64} />
                        </div>
                        <div className="flex flex-col items-center">
                            <h4 className="text-2xl font-black text-slate-400 italic tracking-tighter uppercase leading-none">Global Archive is Empty</h4>
                            <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.4em] mt-3">Ready for Registry Session Initialization</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default StudentTable;
