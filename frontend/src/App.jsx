import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Plus, Search, Activity, Layers, AlertTriangle, ShieldCheck, Clock, Terminal, Star, UserCheck, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';

// Stitch ERP Modules
import api from './api/api';
import Login from './stitch/Auth/Login';
import Sidebar from './stitch/Layout/Sidebar';
import Metrics from './stitch/Dashboard/Metrics';
import Charts from './stitch/Dashboard/Charts';
import StudentTable from './stitch/Students/StudentTable';
import StudentModal from './stitch/Students/StudentModal';
import StudentProfileModal from './stitch/Students/StudentProfileModal';
import DepartmentManager from './stitch/Masters/DepartmentManager';
import SubjectManager from './stitch/Masters/SubjectManager';
import MarkEntryHub from './stitch/Marks/MarkEntryHub';
import InsightHub from './stitch/Analytics/InsightHub';
import ReportCenter from './stitch/Reports/ReportCenter';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('smms_auth') === 'true';
  });

  const handleLogin = async (username, password) => {
    try {
      const res = await api.post('/login', { username, password });
      if (res.data.msg === "Login successful") {
        localStorage.setItem('smms_auth', 'true');
        setIsAuthenticated(true);
        toast.success("Welcome Admin");
      }
    } catch (error) {
      toast.error("Invalid Login Credentials");
    }
  };

  const logout = () => {
    localStorage.removeItem('smms_auth');
    setIsAuthenticated(false);
    toast.success("Logged Out Successfully");
  };

  if (!isAuthenticated) return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Login onLogin={handleLogin} />
    </>
  );

  return (
    <Router>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#0F172A',
            color: '#fff',
            borderRadius: '1rem',
            padding: '1rem 2rem',
            fontSize: '12px',
            fontWeight: '600'
          }
        }}
      />
      <MainApp logout={logout} />
    </Router>
  );
};

const MainApp = ({ logout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname.split('/')[1] || 'dashboard';

  const [students, setStudents] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [editStudent, setEditStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [metrics, setMetrics] = useState({ total: 0, avg: '0%', passed: 0, failed: 0 });
  const [formData, setFormData] = useState({ student_id: '', name: '', roll_no: '', department_id: '' });

  useEffect(() => {
    fetchData();
    fetchAuditLogs();
    fetchMetrics();
  }, [location.pathname]);

  const fetchData = async () => {
    try {
      const response = await api.get('/students/');
      setStudents(response.data);
    } catch (error) {
      toast.error("Error fetching students");
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await api.get('/metrics/');
      setMetrics(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const response = await api.get('/audit-logs/');
      setAuditLogs(response.data.map(log => ({
        msg: log.message,
        time: log.timestamp,
        type: log.action_type || 'INFO',
        id: log.id
      })));
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModal = (student = null) => {
    if (student) {
      setEditStudent(student);
      setFormData({
        student_id: student.student_id,
        name: student.name,
        roll_no: student.roll_no,
        department_id: student.department_id
      });
    } else {
      setEditStudent(null);
      setFormData({ student_id: '', name: '', roll_no: '', department_id: '' });
    }
    setIsModalOpen(true);
  };

  const handleOpenProfile = (student) => {
    setSelectedStudent(student);
    setIsProfileOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tid = toast.loading("Saving...");
    try {
      if (editStudent) {
        await api.patch(`/students/${editStudent.id}`, formData);
        toast.success("Student updated", { id: tid });
      } else {
        await api.post('/students/', formData);
        toast.success("Student added", { id: tid });
      }
      setIsModalOpen(false);
      fetchData();
      fetchAuditLogs();
      fetchMetrics();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Error saving data", { id: tid });
    }
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="text-amber-500" size={20} />
          <span className="text-sm font-semibold text-white">Delete student record?</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const lid = toast.loading("Deleting...");
              try {
                await api.delete(`/students/${id}`);
                fetchData();
                fetchAuditLogs();
                fetchMetrics();
                toast.success("Student deleted", { id: lid });
              } catch (error) {
                toast.error(error.response?.data?.detail || "Cannot delete record", { id: lid });
              }
            }}
            className="flex-1 py-2 bg-red-600 text-white rounded-lg text-xs font-bold"
          >
            Confirm
          </button>
          <button onClick={() => toast.dismiss(t.id)} className="flex-1 py-2 bg-white/10 text-white rounded-lg text-xs font-bold">Cancel</button>
        </div>
      </div>
    ), { duration: 5000, position: 'top-center' });
  };

  const getLogStyle = (type) => {
    switch (type) {
      case 'CREATE': return 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400';
      case 'UPDATE': return 'border-blue-500/20 bg-blue-500/5 text-blue-400';
      case 'DELETE': return 'border-rose-500/20 bg-rose-500/5 text-rose-400';
      default: return 'border-slate-500/20 bg-slate-500/5 text-slate-400';
    }
  };

  // GET TOP PERFORMER LOGIC
  const topStudent = students.length > 0 ? [...students].sort((a, b) => b.percentage - a.percentage)[0] : null;

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={(key) => navigate('/' + key)} onLogout={logout} />

      <main className="flex-1 ml-72 overflow-y-auto min-h-screen relative">
        <header className="bg-white/80 backdrop-blur-3xl border-b border-slate-100 px-12 py-10 flex items-center justify-between sticky top-0 z-40">
          <div className="flex flex-col">
            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter italic leading-none">{activeTab}</h2>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-2">Verified System Feed</p>
          </div>
          <div className="flex items-center gap-10">
            <div className="hidden lg:flex items-center gap-4 bg-slate-50 border border-slate-100 px-6 py-4 rounded-[2rem]">
              <Search size={18} className="text-slate-200" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-xs font-bold text-slate-700 w-64 uppercase"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <img src={`https://ui-avatars.com/api/?name=Admin&background=4F46E5&color=fff&bold=true`} className="w-14 h-14 rounded-2xl shadow-xl border-4 border-white" alt="UI" />
          </div>
        </header>

        <div className="p-12">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                <Metrics metrics={metrics} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                  {/* AUDIT FEED (LEFT) */}
                  <div className="lg:col-span-8 bg-slate-900 rounded-[3rem] p-10 border border-slate-800 shadow-2xl relative overflow-hidden group min-h-[500px] flex flex-col">
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                        <div className="flex items-center gap-4">
                          <Terminal size={24} className="text-indigo-400" />
                          <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Live Audit Feed</h3>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 rounded-full">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                        </div>
                      </div>

                      <div className="space-y-3 pr-2 overflow-y-auto flex-1 scrollbar-hide">
                        {auditLogs.length > 0 ? auditLogs.map((log, idx) => (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            key={log.id}
                            className={`flex items-center justify-between p-5 border rounded-2xl transition-all ${getLogStyle(log.type)}`}
                          >
                            <div className="flex items-center gap-4">
                              <Clock size={14} className="opacity-40" />
                              <span className="text-xs font-bold text-white/90 uppercase tracking-tight">{log.msg}</span>
                            </div>
                            <span className="text-[10px] font-black opacity-30 italic">{log.time}</span>
                          </motion.div>
                        )) : (
                          <div className="py-20 flex flex-col items-center justify-center opacity-10 text-white">
                            <Activity size={48} />
                            <span className="text-xs font-black uppercase tracking-[0.2em] mt-4">Buffer Empty</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* USEFUL STUDENT DATA (RIGHT) */}
                  <div className="lg:col-span-4 flex flex-col gap-10">

                    {/* LATEST REGISTRATION */}
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-2xl transition-all h-full">
                      <div className="flex items-center justify-between mb-8">
                        <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
                          <UserCheck size={24} />
                        </div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Latest Profile</span>
                      </div>
                      {students.length > 0 ? (
                        <div className="flex flex-col">
                          <h4 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">{students[students.length - 1].name}</h4>
                          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-2">{students[students.length - 1].roll_no} | {students[students.length - 1].department?.name}</span>
                          <div className="mt-8 pt-8 border-t border-slate-50">
                            <button onClick={() => handleOpenProfile(students[students.length - 1])} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 flex items-center gap-2">View details <TrendingUp size={14} /></button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-slate-300 mt-2">No records found</span>
                      )}
                    </div>

                    {/* TOP PERFORMER CARD */}
                    <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex flex-col relative overflow-hidden border border-white/5 shadow-2xl h-full group">
                      <div className="absolute bottom-[-10%] right-[-10%] opacity-10">
                        <Star size={100} className="text-amber-500 fill-amber-500" />
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-500">
                            <Star size={24} className="fill-amber-500" />
                          </div>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hall of Fame</span>
                        </div>

                        {topStudent ? (
                          <div className="flex flex-col">
                            <h3 className="text-2xl font-black tracking-tighter uppercase italic">{topStudent.name}</h3>
                            <div className="flex items-center gap-3 mt-4">
                              <span className="text-4xl font-black text-amber-500 italic">{topStudent.percentage}%</span>
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Score Peak</span>
                            </div>
                            <div className="mt-10">
                              <button onClick={() => navigate('/analytics')} className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Analytics Hub</button>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-500">Awaiting assessments...</span>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            } />
            <Route path="/departments" element={<DepartmentManager />} />
            <Route path="/subjects" element={<SubjectManager />} />
            <Route path="/records" element={
              <div className="space-y-12">
                <div className="flex justify-end">
                  <button onClick={() => handleOpenModal()} className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-bold text-xs flex items-center gap-4 hover:bg-indigo-600 transition-all shadow-xl active:scale-95">
                    <Plus size={18} /> Add Student
                  </button>
                </div>
                <StudentTable students={students} onEdit={handleOpenModal} onDelete={handleDelete} onShowProfile={handleOpenProfile} />
              </div>
            } />
            <Route path="/marks" element={<MarkEntryHub />} />
            <Route path="/analytics" element={<InsightHub students={students} onShowProfile={handleOpenProfile} />} />
            <Route path="/reports" element={<ReportCenter students={students} onExportPDF={() => { }} onExportCSV={() => { }} />} />
          </Routes>
        </div>
      </main>

      <StudentModal
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit}
        formData={formData} setFormData={setFormData} editStudent={editStudent}
      />

      <StudentProfileModal
        isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} student={selectedStudent}
      />
    </div>
  );
};

export default App;
