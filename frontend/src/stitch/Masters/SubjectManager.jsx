import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, FileText, X, Edit, AlertTriangle, Cpu, Target, Layers, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../api/api';

const SubjectManager = () => {
    const [subjects, setSubjects] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({ name: '', code: '', credits: 3, department_id: '' });

    useEffect(() => {
        fetchSubjects();
        fetchDepartments();
    }, []);

    const fetchSubjects = async () => {
        try {
            const res = await api.get('/subjects/');
            setSubjects(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const res = await api.get('/departments/');
            setDepartments(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenModal = (sub = null) => {
        if (sub) {
            setEditMode(true);
            setSelectedId(sub.id);
            setFormData({ name: sub.name, code: sub.code, credits: sub.credits, department_id: sub.department_id });
        } else {
            setEditMode(false);
            setFormData({ name: '', code: '', credits: 3, department_id: departments[0]?.id || '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const tid = toast.loading("Saving...");
        try {
            if (editMode) {
                await api.patch(`/subjects/${selectedId}`, formData);
                toast.success("Module updated", { id: tid });
            } else {
                await api.post('/subjects/', formData);
                toast.success("Module added", { id: tid });
            }
            setIsModalOpen(false);
            fetchSubjects();
        } catch (error) {
            toast.error(error.response?.data?.detail || "Error saving subject", { id: tid });
        }
    };

    const handleDelete = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <AlertTriangle className="text-amber-500" size={20} />
                    <span className="text-sm font-semibold text-white italic">Confirm module removal?</span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            const lid = toast.loading("Deleting...");
                            try {
                                await api.delete(`/subjects/${id}`);
                                fetchSubjects();
                                toast.success("Module deleted", { id: lid });
                            } catch (error) {
                                toast.error(error.response?.data?.detail || "Cannot delete record", { id: lid });
                            }
                        }}
                        className="flex-1 py-2 bg-red-600 text-white rounded-xl text-xs font-bold uppercase transition-colors"
                    >
                        Delete
                    </button>
                    <button onClick={() => toast.dismiss(t.id)} className="flex-1 py-2 bg-white/10 text-white rounded-xl text-xs font-bold uppercase transition-colors">Cancel</button>
                </div>
            </div>
        ), { duration: 5000, position: 'top-center' });
    };

    return (
        <div className="space-y-12">
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter italic leading-none">Modules</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3 flex items-center gap-2">
                        <Cpu size={12} className="text-emerald-500" /> Mastery Archive Ingestor
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-bold text-[11px] uppercase tracking-widest flex items-center gap-4 hover:bg-emerald-600 transition-all hover:shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:-translate-y-1 active:scale-95 shadow-2xl"
                >
                    <Plus size={18} /> New Module
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {subjects.map((subject, index) => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        key={subject.id}
                        className="group bg-white p-10 rounded-[4rem] border border-slate-50 shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[20px_40px_80px_rgba(0,0,0,0.06)] hover:border-emerald-100 transition-all relative overflow-hidden flex flex-col"
                    >
                        {/* Background Code Stamp */}
                        <div className="absolute bottom-[-10%] right-[-10%] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity transform group-hover:rotate-12 group-hover:scale-125">
                            <span className="text-8xl font-black italic">{subject.code}</span>
                        </div>

                        {/* HIGH VISIBILITY CREDIT BADGE */}
                        <div className="absolute top-8 right-8">
                            <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl border ${subject.credits >= 4 ? 'bg-indigo-600 border-indigo-400 shadow-[0_10px_30px_rgba(79,70,229,0.4)]' : 'bg-slate-900 border-slate-700'} text-white transition-all transform group-hover:scale-110 group-hover:rotate-6`}>
                                <span className="text-[10px] font-black opacity-50 leading-none">CR</span>
                                <span className="text-xl font-black leading-none mt-1">{subject.credits}</span>
                            </div>
                        </div>

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="p-4 bg-emerald-50 rounded-3xl w-fit text-emerald-600 mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                                <FileText size={22} />
                            </div>

                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <Target size={10} className="text-emerald-400" /> MASTER ID: {subject.code}
                            </span>
                            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-10 leading-tight group-hover:text-emerald-600 transition-colors h-14 line-clamp-2 overflow-hidden">{subject.name}</h3>

                            <div className="flex items-center justify-between border-t border-slate-100 pt-8 mt-auto">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Weightage Status</span>
                                    <span className={`text-xs font-black uppercase tracking-widest mt-1 ${subject.credits >= 4 ? 'text-indigo-600' : 'text-slate-500'}`}>
                                        {subject.credits >= 4 ? 'High Priority' : 'Standard'}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleOpenModal(subject)} className="p-3 bg-slate-50 rounded-2xl text-slate-300 hover:bg-slate-900 hover:text-white transition-all shadow-sm"><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(subject.id)} className="p-3 bg-slate-50 rounded-2xl text-slate-300 hover:bg-rose-500 hover:text-white transition-all shadow-sm"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 50 }}
                            className="bg-white rounded-[4.5rem] p-16 max-w-2xl w-full shadow-2xl relative"
                        >
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-12 right-12 text-slate-300 hover:text-slate-900 transition-colors"><X size={32} /></button>
                            <div className="flex items-center gap-6 mb-12">
                                <div className="p-6 bg-emerald-600 rounded-[2rem] text-white shadow-2xl shadow-emerald-500/30">
                                    <Layers size={32} />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic border-l-8 border-emerald-600 pl-6 mb-1">
                                        {editMode ? 'Update Module' : 'Add Module'}
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-8">Registry Mastery Control</p>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 ml-8 uppercase tracking-widest">Subject Name</label>
                                        <input
                                            type="text" required
                                            className="w-full px-10 py-6 rounded-[2.5rem] bg-slate-50 border border-slate-50 outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-slate-800 text-sm shadow-inner"
                                            placeholder="Label"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 ml-8 uppercase tracking-widest">Master Code</label>
                                        <input
                                            type="text" required
                                            className="w-full px-10 py-6 rounded-[2.5rem] bg-slate-50 border border-slate-50 outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-slate-800 uppercase text-sm shadow-inner"
                                            placeholder="ID-001"
                                            value={formData.code}
                                            onChange={e => setFormData({ ...formData, code: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 ml-8 uppercase tracking-widest">Hub Origin</label>
                                        <select
                                            className="w-full px-10 py-6 rounded-[2.5rem] bg-slate-50 border border-slate-50 outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-slate-800 cursor-pointer text-sm shadow-inner"
                                            value={formData.department_id}
                                            onChange={e => setFormData({ ...formData, department_id: e.target.value })}
                                        >
                                            <option value="" disabled>Select Department</option>
                                            {departments.map(dept => (
                                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 ml-8 uppercase tracking-widest">Weightage (Credits)</label>
                                        <input
                                            type="number" min="1" max="10"
                                            className="w-full px-10 py-6 rounded-[2.5rem] bg-slate-50 border border-slate-50 outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-slate-800 text-sm shadow-inner"
                                            value={formData.credits}
                                            onChange={e => setFormData({ ...formData, credits: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-7 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-emerald-600 hover:shadow-emerald-500/30 transition-all active:scale-95 mt-4">
                                    {editMode ? 'Archive Synch' : 'Register Module'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SubjectManager;
