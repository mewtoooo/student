import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Save, User as UserIcon, Book, Award, Layers } from 'lucide-react';
import api from '../../api/api';

const MarkEntryHub = () => {
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [marks, setMarks] = useState({}); // { subjectId: score }
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await api.get('/students/');
            setStudents(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleStudentSelect = async (studentId) => {
        setSelectedStudentId(studentId);
        const student = students.find(s => s.id === parseInt(studentId));
        setSelectedStudent(student);
        setMarks({});

        if (student) {
            try {
                // Fetch subjects belonging to this student's department
                const res = await api.get(`/subjects/?department_id=${student.department_id}`);
                setSubjects(res.data);

                // Fetch existing marks if any for this student
                const marksRes = await api.get(`/marks/${student.id}`);
                const markMap = {};
                marksRes.data.forEach(m => {
                    markMap[m.subject_id] = m.score;
                });
                setMarks(markMap);
            } catch (error) {
                console.error(error);
            }
        } else {
            setSubjects([]);
        }
    };

    const handleSave = async () => {
        if (!selectedStudent) return;
        setIsSaving(true);
        try {
            for (const subjectId in marks) {
                const payload = {
                    student_id: selectedStudent.id,
                    subject_id: parseInt(subjectId),
                    score: parseInt(marks[subjectId]) || 0
                };
                await api.post('/marks/', payload);
            }
            alert("Marks Archive Updated Successfully");
        } catch (error) {
            console.error(error);
            alert("Error syncing marks - Subject/Dept integrity mismatch.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-12 pb-24">
            <div className="flex flex-col">
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter italic leading-none">Mark Entry Matrix</h2>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-2 ml-1">Credential Assessment Interface</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left: Student Selector */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-slate-900 p-4 rounded-2xl text-white shadow-xl shadow-slate-900/20">
                                <Search size={22} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">Entity Lookup</h3>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Select Identification</label>
                            <select
                                className="w-full px-8 py-6 rounded-[2.25rem] bg-slate-50 border border-slate-200 outline-none focus:ring-8 focus:ring-indigo-100 focus:border-indigo-500 font-bold text-slate-800 cursor-pointer shadow-sm transition-all"
                                value={selectedStudentId}
                                onChange={e => handleStudentSelect(e.target.value)}
                            >
                                <option value="">--- CHOOSE STUDENT ---</option>
                                {students.map(s => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.student_id})</option>
                                ))}
                            </select>
                        </div>

                        {selectedStudent && (
                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mt-12 pt-12 border-t border-slate-50 space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-indigo-600/20">
                                        {selectedStudent.name.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-slate-900 tracking-tighter uppercase">{selectedStudent.name}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100 px-3 py-1 rounded-full mt-1">Roll: {selectedStudent.roll_no}</span>
                                    </div>
                                </div>
                                <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 flex items-center gap-4">
                                    <Layers className="text-emerald-500" size={20} />
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em] leading-none mb-1">Assigned Department Hub</span>
                                        <span className="text-xs font-black text-slate-800 uppercase tracking-tighter italic">{selectedStudent.department?.name || 'System Querying...'}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Right: Grade Entry Matrix */}
                <div className="lg:col-span-8">
                    <AnimatePresence mode="wait">
                        {selectedStudent ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="bg-slate-900 p-12 rounded-[4rem] border border-slate-800 shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

                                <div className="flex items-center justify-between mb-12 relative z-10">
                                    <div className="flex flex-col">
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">Assessment Matrix</h3>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2 ml-1">Credential Assessment for {selectedStudent.department?.name}</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-indigo-400 group hover:animate-pulse transition-all"><Book size={20} /></div>
                                    </div>
                                </div>

                                <div className="space-y-6 relative z-10">
                                    {subjects.length > 0 ? subjects.map((sub) => (
                                        <div key={sub.id} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white/5 p-8 rounded-[2.5rem] border border-white/5 hover:border-indigo-500/30 transition-all hover:bg-white/10">
                                            <div className="md:col-span-8 flex items-center gap-6">
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/10">
                                                    {sub.code}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[14px] font-black text-white uppercase tracking-tighter">{sub.name}</span>
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Weightage: {sub.credits} Credits</span>
                                                </div>
                                            </div>
                                            <div className="md:col-span-4">
                                                <div className="relative">
                                                    <input
                                                        type="number" min="0" max="100"
                                                        className="w-full bg-slate-950 border border-white/10 rounded-2xl py-5 px-6 text-2xl font-black text-center text-white focus:ring-8 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-2xl"
                                                        value={marks[sub.id] || ''}
                                                        onChange={e => setMarks({ ...marks, [sub.id]: e.target.value })}
                                                    />
                                                    <span className="absolute top-1/2 -translate-y-1/2 right-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Mark</span>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="py-24 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10 border-indigo-500/20">
                                            <div className="flex flex-col p-10 items-center gap-6">
                                                <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center text-indigo-500 animate-pulse"><Award size={40} /></div>
                                                <div className="flex flex-col">
                                                    <h4 className="text-white font-black uppercase italic tracking-tighter text-xl leading-none">Modules Not Initialized</h4>
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3">Please Add Subjects to the {selectedStudent.department?.name} Hub Erstwhile</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {subjects.length > 0 && (
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="w-full mt-12 py-8 bg-indigo-600 text-white rounded-[2.5rem] font-black uppercase text-[12px] tracking-[0.4em] shadow-[0_25px_60px_-15px_rgba(79,70,229,0.5)] hover:bg-white hover:text-indigo-600 transition-all flex items-center justify-center gap-6 group disabled:opacity-50"
                                    >
                                        <Save size={24} className="group-hover:-translate-y-1 transition-transform" />
                                        {isSaving ? 'Synchronizing with Database...' : 'Commit Assessment to Global Archive'}
                                    </button>
                                )}
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center bg-white rounded-[4rem] border-4 border-dashed border-slate-100 py-48 text-center px-12">
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} className="mb-12">
                                    <Layers size={80} className="text-slate-100" />
                                </motion.div>
                                <h4 className="text-2xl font-black text-slate-200 uppercase tracking-tighter italic leading-none">Awaiting Identity Selection</h4>
                                <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest mt-4">Select an Entity to Initialize Terminal Performance Data System</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default MarkEntryHub;
