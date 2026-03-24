import React from 'react';
import { FileText, FileDown, Download, Layers, ShieldCheck, Printer, ArrowRight, CheckCircle2, CloudDownload } from 'lucide-react';
import { motion } from 'framer-motion';

const ReportCenter = ({ students, onExportPDF, onExportCSV }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-16 pb-32"
        >
            {/* Page Header Section */}
            <div className="flex flex-col mb-12">
                <h1 className="text-4xl font-black text-slate-800 tracking-tighter italic">Document <span className="text-indigo-600">Registry Hub</span></h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mt-3">Centralized Data Export Pipeline • Systems Operational</p>
            </div>

            {/* Central Reporting Actions - 2 Wide Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full px-4">
                {/* PDF Transcript Card */}
                <motion.div
                    whileHover={{ y: -10 }}
                    className="relative bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl shadow-indigo-500/5 group overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-rose-500/10 transition-colors" />

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-10">
                            <div className="w-20 h-20 bg-gradient-to-tr from-rose-600 to-rose-400 rounded-[2.25rem] flex items-center justify-center text-white shadow-2xl shadow-rose-500/30 group-hover:rotate-6 transition-transform duration-500">
                                <FileDown size={36} />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full mb-2">Verified PDF</span>
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none">A4 ISO-Standard</span>
                            </div>
                        </div>

                        <h4 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-4 leading-none">Official Batch Transcript</h4>
                        <p className="text-[12px] font-bold text-slate-500 leading-relaxed mb-10 opacity-70">
                            Generate high-fidelity PDF transcripts optimized for printing. This report aggregates student performance,
                            grading benchmarks, and departmental averages into a structured layout compliant with university reporting standards.
                        </p>

                        <div className="mt-auto flex flex-col gap-6">
                            <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance Data Synced</span>
                                </div>
                                <span className="text-[10px] font-black text-indigo-600">Integrity Check OK</span>
                            </div>
                            <button
                                onClick={() => { console.log("Exporting PDF..."); onExportPDF(); }}
                                className="w-full h-16 bg-slate-900 text-white rounded-[1.75rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-rose-600 transition-all shadow-[0_20px_40px_-12px_rgba(2,6,23,0.3)] hover:shadow-rose-600/30 group/btn active:scale-95"
                            >
                                <CloudDownload size={20} className="group-hover/btn:animate-bounce" /> Execute PDF Export
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* CSV Metadata Card */}
                <motion.div
                    whileHover={{ y: -10 }}
                    className="relative bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl shadow-emerald-500/5 group overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/10 transition-colors" />

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-10">
                            <div className="w-20 h-20 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-[2.25rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30 group-hover:-rotate-6 transition-transform duration-500">
                                <Layers size={36} />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-2">RAW DATA HUB</span>
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none">Excel Optimized</span>
                            </div>
                        </div>

                        <h4 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-4 leading-none">Structured Data Sheet</h4>
                        <p className="text-[12px] font-bold text-slate-500 leading-relaxed mb-10 opacity-70">
                            Extract raw batch metadata into a localized CSV document. This feature is mission-critical for office administrators
                            requiring bulk data processing, external backups, or programmatic registry migrations.
                        </p>

                        <div className="mt-auto flex flex-col gap-6">
                            <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Metadata Hash Verified</span>
                                </div>
                                <span className="text-[10px] font-black text-indigo-600">Sync Status: Real-time</span>
                            </div>
                            <button
                                onClick={() => { console.log("Exporting CSV..."); onExportCSV(); }}
                                className="w-full h-16 bg-slate-900 text-white rounded-[1.75rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-emerald-600 transition-all shadow-[0_20px_40px_-12px_rgba(2,6,23,0.3)] hover:shadow-emerald-600/30 group/btn active:scale-95"
                            >
                                <CloudDownload size={20} className="group-hover/btn:animate-bounce" /> Initialize CSV Pull
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Insight Section */}
            <section className="bg-slate-900 p-16 rounded-[4.5rem] relative overflow-hidden shadow-2xl shadow-indigo-900/40">
                <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[10rem] -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="flex flex-col max-w-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldCheck size={28} className="text-emerald-400" />
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">Integrity Protocol Operational</h3>
                        </div>
                        <p className="text-[13px] font-bold text-slate-400 leading-relaxed uppercase tracking-tighter">
                            Your exported reports are automatically timestamped and verified against the central student registry hub.
                            Ensure all batch records are synced before final transcript execution.
                        </p>
                    </div>
                    <div className="flex items-center gap-6 bg-white/5 p-8 rounded-[3rem] border border-white/10 backdrop-blur-xl">
                        <div className="flex flex-col items-center">
                            <span className="text-5xl font-black text-white tracking-tighter italic">{students.length}</span>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Managed Archive</span>
                        </div>
                        <div className="w-px h-16 bg-white/10 mx-4" />
                        <div className="flex flex-col items-center">
                            <span className="text-5xl font-black text-emerald-400 tracking-tighter italic">100%</span>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Export Health</span>
                        </div>
                    </div>
                </div>
            </section>
        </motion.div>
    );
};

export default ReportCenter;
