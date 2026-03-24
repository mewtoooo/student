import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, GraduationCap, X, Edit, AlertTriangle, ArrowRight, Hash } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../api/api';

const DepartmentManager = () => {
    const [departments, setDepartments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const res = await api.get('/departments/');
            setDepartments(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenModal = (dept = null) => {
        if (dept) {
            setEditMode(true);
            setSelectedId(dept.id);
            setFormData({ name: dept.name, description: dept.description || '' });
        } else {
            setEditMode(false);
            setFormData({ name: '', description: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const tid = toast.loading("Saving...");
        try {
            if (editMode) {
                await api.patch(`/departments/${selectedId}`, formData);
                toast.success("Department updated", { id: tid });
            } else {
                await api.post('/departments/', formData);
                toast.success("Department added", { id: tid });
            }
            setIsModalOpen(false);
            fetchDepartments();
        } catch (error) {
            toast.error(error.response?.data?.detail || "Error saving department", { id: tid });
        }
    };

    const handleDelete = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <AlertTriangle className="text-amber-500" size={20} />
                    <span className="text-sm font-semibold text-white">Delete Department?</span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            const lid = toast.loading("Deleting...");
                            try {
                                await api.delete(`/departments/${id}`);
                                fetchDepartments();
                                toast.success("Department deleted", { id: lid });
                            } catch (error) {
                                toast.error(error.response?.data?.detail || "Cannot delete record", { id: lid });
                            }
                        }}
                        className="flex-1 py-2 bg-red-600 text-white rounded-lg text-xs font-bold"
                    >
                        Delete
                    </button>
                    <button onClick={() => toast.dismiss(t.id)} className="flex-1 py-2 bg-white/10 text-white rounded-lg text-xs font-bold">Cancel</button>
                </div>
            </div>
        ), { duration: 5000, position: 'top-center' });
    };

    return (
        <div className="space-y-12">
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Departments</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3 flex items-center gap-2">
                        <Hash size={12} className="text-indigo-500" /> Active Campus Mastery
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-bold text-[11px] uppercase tracking-widest flex items-center gap-4 hover:bg-indigo-600 transition-all hover:shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:-translate-y-1 active:scale-95"
                >
                    <Plus size={18} /> New Department
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {departments.map((dept, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={dept.id}
                        className="group bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] hover:border-indigo-100 transition-all relative overflow-hidden flex flex-col min-h-[320px]"
                    >
                        {/* Abstract Background Design */}
                        <div className="absolute top-[-20px] right-[-20px] w-64 h-64 bg-slate-50 rounded-full opacity-20 group-hover:bg-indigo-50 group-hover:scale-110 transition-all duration-700" />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-start justify-between mb-8">
                                <div className="p-5 bg-slate-900 rounded-[1.75rem] text-white shadow-2xl group-hover:bg-indigo-600 transition-colors">
                                    <GraduationCap size={28} />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleOpenModal(dept)} className="p-3 bg-slate-50 rounded-xl text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 transition-all"><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(dept.id)} className="p-3 bg-slate-50 rounded-xl text-slate-300 hover:bg-rose-50 hover:text-rose-600 transition-all"><Trash2 size={16} /></button>
                                </div>
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4 group-hover:text-indigo-600 transition-colors leading-none">{dept.name}</h3>
                            <p className="text-xs font-bold text-slate-400 leading-relaxed mb-10 opacity-80 group-hover:opacity-100 line-clamp-3 flex-1">{dept.description || 'Global institutional hub with integrated performance tracking and student management protocols.'}</p>

                            <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-5 py-2 rounded-full">Primary Hub</span>
                                <div className="p-2 bg-slate-50 rounded-full text-slate-200 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:translate-x-2">
                                    <ArrowRight size={18} />
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
                            initial={{ scale: 0.9, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 40 }}
                            className="bg-white rounded-[4rem] p-16 max-w-lg w-full shadow-2xl border border-slate-100 relative"
                        >
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-12 right-12 text-slate-300 hover:text-slate-900 transition-colors"><X size={28} /></button>
                            <div className="mb-12">
                                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic border-l-8 border-indigo-600 pl-6 mb-2">
                                    {editMode ? 'Synch Hub' : 'New Hub'}
                                </h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-8">Institution Master Setup</p>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 ml-6 uppercase tracking-widest">Department Name</label>
                                    <input
                                        type="text" required
                                        className="w-full px-10 py-6 rounded-[2.5rem] bg-slate-50 border border-slate-50 outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold text-slate-800 text-sm shadow-inner"
                                        placeholder="e.g. Applied Science"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 ml-6 uppercase tracking-widest">Description</label>
                                    <textarea
                                        className="w-full px-10 py-6 rounded-[2.5rem] bg-slate-50 border border-slate-50 outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold text-slate-800 text-sm min-h-[140px] shadow-inner"
                                        placeholder="Enter hub description..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="w-full py-7 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-indigo-600 hover:shadow-indigo-500/30 transition-all active:scale-95 mt-4">
                                    {editMode ? 'Update Mastery' : 'Initialize Hub'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DepartmentManager;
