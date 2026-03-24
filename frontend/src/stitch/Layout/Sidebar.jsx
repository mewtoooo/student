import React from 'react';
import { LayoutDashboard, Users, BarChart3, Settings, LogOut, GraduationCap, FileText } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
    const navItems = [
        { key: 'dashboard', icon: <LayoutDashboard size={20} />, label: "Dashboard Hub" },
        { key: 'departments', icon: <GraduationCap size={20} />, label: "Departments" },
        { key: 'subjects', icon: <FileText size={20} />, label: "Subject Master" },
        { key: 'records', icon: <Users size={20} />, label: "Student Registry" },
        { key: 'marks', icon: <BarChart3 size={20} />, label: "Mark Engine" },
        { key: 'analytics', icon: <BarChart3 size={20} />, label: "Performance Hub" },
        { key: 'reports', icon: <FileText size={20} />, label: "Registry Reports" },
    ];

    return (
        <aside className="w-72 bg-[#0F172A] flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800/50 z-50">
            <div className="p-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 transform -rotate-6">
                    <GraduationCap className="text-white" size={26} />
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-black text-white tracking-tighter leading-none italic">SMMS <span className="text-indigo-400">PRO</span></span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">v8.2.0 Cloud</span>
                </div>
            </div>

            <nav className="flex-1 px-6 space-y-2 mt-4">
                {navItems.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => setActiveTab(item.key)}
                        className={`w-full group flex items-center gap-4 px-5 py-4 rounded-2xl text-[13px] font-bold transition-all duration-300 relative overflow-hidden ${activeTab === item.key
                            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-900/40'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                            }`}
                    >
                        <span className={`transition-transform duration-300 ${activeTab === item.key ? 'scale-110' : 'group-hover:scale-110'}`}>
                            {item.icon}
                        </span>
                        <span className="tracking-wide">{item.label}</span>
                        {activeTab === item.key && (
                            <div className="absolute right-0 top-0 h-full w-1 bg-white rounded-l-full" />
                        )}
                    </button>
                ))}
            </nav>

            <div className="p-8 border-t border-slate-800/50">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[13px] font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all group"
                >
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>System Exit</span>
                </button>

                <div className="mt-8 bg-slate-800/30 p-4 rounded-2xl border border-slate-700/30">
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed uppercase tracking-tighter">Student Marks Management Hub</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
