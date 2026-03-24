import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

const Login = ({ onLogin }) => {
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(loginForm.username, loginForm.password);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="bg-primary-600 p-4 rounded-2xl shadow-xl shadow-primary-500/20 mb-6 transform -rotate-3">
                        <GraduationCap className="text-white" size={40} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
                        SMMS <span className="text-primary-600">PRO</span>
                    </h1>
                    <p className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                        Educator Administration Portal
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System Username</label>
                        <input
                            type="text"
                            className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all font-medium text-slate-800 bg-slate-50/50"
                            placeholder="e.g. admin"
                            value={loginForm.username}
                            onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System Password</label>
                        <input
                            type="password"
                            className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all font-medium text-slate-800 bg-slate-50/50"
                            placeholder="••••••••"
                            value={loginForm.password}
                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-primary-600 hover:shadow-primary-500/30 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                        Initialize Session
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em] border-t border-slate-100 pt-6">
                        Secured by AES-256 Cloud Standard
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
