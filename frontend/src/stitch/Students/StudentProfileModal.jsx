import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, User as UserIcon, BookOpen, Layers, Award, ShieldCheck, Mail, MapPin, Calendar, Clock, BarChart3, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import api from '../../api/api';

const StudentProfileModal = ({ isOpen, onClose, student }) => {
    const [marks, setMarks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && student) {
            fetchMarks();
        }
    }, [isOpen, student]);

    const fetchMarks = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/marks/${student.id}`);
            setMarks(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !student) return null;

    const totalScore = marks.reduce((acc, current) => acc + current.score, 0);
    const avgScore = marks.length > 0 ? (totalScore / marks.length).toFixed(1) : 0;
    const grade = avgScore >= 75 ? 'DISTINCTION' : avgScore >= 40 ? 'QUALIFIED' : 'CRITICAL';

    return (
        <AnimatePresence mode="wait">
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/95 backdrop-blur-3xl">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 50 }}
                    className="bg-white rounded-[5rem] shadow-2xl w-full max-w-6xl overflow-hidden relative flex flex-col h-[85vh] border border-slate-100"
                >
                    {/* Header: Identity Hub */}
                    <div className="bg-slate-900 p-16 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 shrink-0">
                        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[10rem] -translate-y-1/2 translate-x-1/2" />
                        <button onClick={onClose} className="absolute top-10 right-10 text-slate-500 hover:text-white transition-colors z-20"><X size={32} /></button>

                        <div className="relative z-10 group">
                            <div className="w-40 h-40 rounded-[3rem] bg-white p-2 shadow-2xl group-hover:rotate-6 transition-transform duration-700">
                                <img src={`https://ui-avatars.com/api/?name=${student.name}&background=6366f1&color=fff&size=512&bold=true`} className="w-full h-full rounded-[2.5rem] object-cover shadow-inner" alt="P" />
                            </div>
                            <div className="absolute -bottom-4 -right-4 bg-emerald-500 text-white p-3 rounded-2xl shadow-xl shadow-emerald-500/20"><ShieldCheck size={20} /></div>
                        </div>

                        <div className="flex flex-col relative z-10 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                                <h2 className="text-5xl font-black text-white tracking-tighter italic leading-none">{student.name}</h2>
                                <span className="bg-indigo-600/30 text-indigo-400 border border-indigo-600/30 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest">Registry Verified</span>
                            </div>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                <div className="flex items-center gap-2 text-slate-400 text-[11px] font-black uppercase tracking-widest"><UserIcon size={14} className="text-indigo-400" /> ID: {student.student_id}</div>
                                <div className="hidden md:block w-px h-4 bg-slate-800" />
                                <div className="flex items-center gap-2 text-slate-400 text-[11px] font-black uppercase tracking-widest"><BookOpen size={14} className="text-indigo-400" /> ROLL: {student.roll_no}</div>
                                <div className="hidden md:block w-px h-4 bg-slate-800" />
                                <div className="flex items-center gap-2 text-slate-400 text-[11px] font-black uppercase tracking-widest"><Layers size={14} className="text-indigo-400" /> {student.department?.name}</div>
                            </div>
                        </div>

                        <div className="flex-1 hidden lg:flex flex-col items-end relative z-10 gap-4">
                            <div className="bg-white/5 border border-white/5 p-6 rounded-[2.5rem] backdrop-blur-xl">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-indigo-500/30 pb-2 mb-4 block">Performance Status</span>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-5xl font-black text-indigo-400 tracking-tighter italic">{student.percentage}%</h3>
                                    <span className="text-[10px] font-black text-emerald-500 uppercase">Weighted Score</span>
                                </div>
                            </div>
                            <div className={`px-6 py-2 rounded-full text-[9px] font-black tracking-widest uppercase italic shadow-lg ${student.status === 'PASS' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                student.status === 'SUPPLY' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                    'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                }`}>{student.status} GRADE</div>
                        </div>
                    </div>

                    {/* Content Matrix */}
                    <div className="flex-1 overflow-y-auto p-16 bg-[#F8FAFC]">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* Left: Score Hub */}
                            <div className="lg:col-span-8 space-y-10">
                                <div className="flex items-center justify-between mb-4 px-4">
                                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic border-l-8 border-indigo-500 pl-6 h-10 flex items-center">Credential Assessment</h3>
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-slate-300"><BarChart3 size={24} /></div>
                                </div>

                                <div className="grid gap-6">
                                    {marks.length > 0 ? marks.map((mark, i) => (
                                        <div key={i} className="group bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all flex items-center justify-between relative overflow-hidden">
                                            <div className="relative z-10 flex items-center gap-8">
                                                <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-800 font-black text-xs shadow-inner group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-500">
                                                    {mark.subject?.code}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-lg font-black text-slate-800 uppercase tracking-tighter leading-none mb-2">{mark.subject?.name}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{mark.subject?.credits} Credits Weightage</span>
                                                </div>
                                            </div>
                                            <div className="relative z-10 flex items-baseline gap-2">
                                                <h4 className={`text-4xl font-black italic tracking-tighter ${mark.score >= 40 ? 'text-slate-900 group-hover:text-indigo-600' : 'text-rose-600'} transition-colors`}>{mark.score}</h4>
                                                <span className="text-[10px] font-black text-slate-300 uppercase">Pts</span>
                                            </div>
                                            <div className="absolute top-0 right-0 h-full w-2 bg-slate-50 group-hover:bg-indigo-500 transition-colors" />
                                        </div>
                                    )) : (
                                        <div className="p-24 bg-white rounded-[4rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center gap-6">
                                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 animate-pulse"><BookOpen size={40} /></div>
                                            <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.4em]">No Assessment Data Found</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right: Meta Matrix */}
                            <div className="lg:col-span-4 space-y-10">
                                <div className="bg-slate-900 p-10 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
                                    <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-widest mb-10 border-b border-white/5 pb-4">Diagnostic Analytics</h4>

                                    <div className="space-y-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-emerald-400"><TrendingUp size={24} /></div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Max Score Observed</span>
                                                <span className="text-xl font-black italic text-white tracking-tighter">{marks.length > 0 ? Math.max(...marks.map(m => m.score)) : 0} POINTS</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-rose-400"><TrendingDown size={24} /></div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Min Score Registry</span>
                                                <span className="text-xl font-black italic text-white tracking-tighter">{marks.length > 0 ? Math.min(...marks.map(m => m.score)) : 0} POINTS</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-12 bg-white/5 rounded-[2.5rem] p-8 border border-white/5 backdrop-blur-3xl flex flex-col items-center">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Registry Ingestion Time</span>
                                        <div className="flex items-center gap-3 text-indigo-400 font-bold border border-indigo-400/20 px-6 py-2 rounded-2xl">
                                            <Clock size={16} />
                                            <span className="text-xs">{new Date().toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-10 group hover:shadow-2xl transition-all duration-500">
                                    <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">Academic Registry Result</h4>
                                        <div className={`px-4 py-2 rounded-xl text-[9px] font-black tracking-widest uppercase shadow-sm border ${student.status === 'PASS' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                            student.status === 'SUPPLY' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                                                'bg-rose-500/10 text-rose-600 border-rose-500/20'
                                            }`}>
                                            {student.status}
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-[2rem] bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-6 shadow-sm"><Award size={24} /></div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Credits Earned</span>
                                                <span className="text-2xl font-black italic text-slate-900 tracking-tighter">{marks.reduce((acc, current) => current.score >= 35 ? acc + (current.subject?.credits || 0) : acc, 0)} UNITS</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-sm ${student.backlog_count > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                {student.backlog_count > 0 ? <AlertTriangle size={24} /> : <ShieldCheck size={24} />}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Backlog Integrity</span>
                                                <span className="text-xl font-black italic tracking-tighter">
                                                    {student.backlog_count > 0 ? `${student.backlog_count} ACTIVE LOG(S)` : 'ZERO BACKLOGS'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-300 shadow-sm"><Calendar size={24} /></div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Registry Session</span>
                                                <span className="text-xs font-bold italic uppercase">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-50">
                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest text-center leading-relaxed">Verified by Academic Council Management System</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default StudentProfileModal;
