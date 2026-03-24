import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, GraduationCap, User as UserIcon, BookOpen } from 'lucide-react';
import api from '../../api/api';

const StudentModal = ({ isOpen, onClose, onSubmit, formData, setFormData, editStudent }) => {
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchDepartments();
        }
    }, [isOpen]);

    const fetchDepartments = async () => {
        try {
            const res = await api.get('/departments/');
            setDepartments(res.data);
            if (!formData.department_id && res.data.length > 0) {
                setFormData(prev => ({ ...prev, department_id: res.data[0].id }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence mode="wait">
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/90 backdrop-blur-md">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 30 }}
                    className="bg-white rounded-[4rem] shadow-2xl w-full max-w-2xl overflow-hidden p-16 relative border border-slate-100 shadow-indigo-500/10"
                >
                    <button onClick={onClose} className="absolute top-12 right-12 text-slate-300 hover:text-slate-900 transition-colors"><X size={28} /></button>

                    <div className="flex flex-col mb-12">
                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none flex items-center gap-4">
                            <span className="w-12 h-1 text-indigo-600 bg-indigo-600 block rounded-full" />
                            {editStudent ? 'Update Registry' : 'New Identity Entry'}
                        </h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-4 ml-1">Database Initialization Request</p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Registry Unique.ID</label>
                                <div className="relative">
                                    <input
                                        type="text" required disabled={!!editStudent}
                                        className="w-full px-8 py-5 rounded-[2.25rem] bg-slate-50 border border-slate-200 outline-none focus:ring-8 focus:ring-indigo-100 focus:border-indigo-600 transition-all font-black text-slate-800 italic uppercase"
                                        placeholder="STU-001"
                                        value={formData.student_id}
                                        onChange={e => setFormData({ ...formData, student_id: e.target.value })}
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-indigo-600 transition-colors"><X size={16} /></div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Profile Alias</label>
                                <div className="relative">
                                    <input
                                        type="text" required
                                        className="w-full px-8 py-5 rounded-[2.25rem] bg-slate-50 border border-slate-200 outline-none focus:ring-8 focus:ring-indigo-100 focus:border-indigo-600 transition-all font-black text-slate-800 placeholder:text-slate-200"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200"><UserIcon size={18} /></div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Internal Roll No</label>
                                <div className="relative">
                                    <input
                                        type="text" required
                                        className="w-full px-8 py-5 rounded-[2.25rem] bg-slate-50 border border-slate-200 outline-none focus:ring-8 focus:ring-indigo-100 focus:border-indigo-600 transition-all font-black text-slate-800 uppercase"
                                        placeholder="ROLL-001"
                                        value={formData.roll_no}
                                        onChange={e => setFormData({ ...formData, roll_no: e.target.value })}
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200"><BookOpen size={18} /></div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Assigned Hub Hub</label>
                                <div className="relative">
                                    <select
                                        required
                                        className="w-full px-8 py-5 rounded-[2.25rem] bg-slate-50 border border-slate-200 outline-none focus:ring-8 focus:ring-indigo-100 focus:border-indigo-600 transition-all font-black text-slate-800 cursor-pointer shadow-sm"
                                        value={formData.department_id}
                                        onChange={e => setFormData({ ...formData, department_id: e.target.value })}
                                    >
                                        <option value="">-- SYSTEM DEPTS ---</option>
                                        {departments.map(dept => (
                                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-10 top-1/2 -translate-y-1/2 text-indigo-400"><GraduationCap size={18} /></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-6 justify-end pt-8">
                            <button
                                type="button" onClick={onClose}
                                className="px-12 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-rose-500 transition-all flex items-center gap-3 active:scale-95"
                            >
                                Discard Buffer
                            </button>
                            <button
                                type="submit"
                                className="bg-slate-900 text-white px-16 py-6 rounded-[2.25rem] font-black uppercase text-[12px] tracking-[0.4em] shadow-[0_25px_60px_-15px_rgba(2,6,23,0.3)] hover:bg-indigo-600 transition-all flex items-center gap-6 group active:scale-95"
                            >
                                <Plus size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                                {editStudent ? 'Save Archive' : 'Commit Registry'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default StudentModal;
