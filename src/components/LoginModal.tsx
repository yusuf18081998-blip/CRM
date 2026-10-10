import React, { useState } from 'react';
import { Student, UserRole } from '../types';
import { TEACHER_CREDENTIALS } from '../data/initialData';
import { Cpu, Lock, User, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';

interface LoginModalProps {
  students: Student[];
  onLoginSuccess: (role: UserRole, student?: Student) => void;
  isOpen: boolean;
  onClose?: () => void;
  allowClose?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  students,
  onLoginSuccess,
  isOpen,
  onClose,
  allowClose = false,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Check if Teacher (Ustoz M.Xo'jayev)
    const isTeacherUser = TEACHER_CREDENTIALS.validUsernames.includes(cleanUser);
    const isTeacherPass = TEACHER_CREDENTIALS.validPasswords.includes(cleanPass);

    if (isTeacherUser && isTeacherPass) {
      onLoginSuccess('admin');
      setUsername('');
      setPassword('');
      return;
    }

    // 2. Check if Student
    const foundStudent = students.find(
      (s) => s.username.toLowerCase() === cleanUser && s.password === cleanPass
    );

    if (foundStudent) {
      onLoginSuccess('student', foundStudent);
      setUsername('');
      setPassword('');
      return;
    }

    // 3. Invalid credentials
    setErrorMessage("Login yoki parol noto'g'ri kiritildi! Iltimos, tekshirib qayta kiriting.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="cyber-glass rounded-2xl max-w-md w-full border border-cyan-500/40 p-6 sm:p-8 shadow-2xl relative my-auto">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] mx-auto mb-3">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div className="text-[11px] font-mono-code text-cyan-400 uppercase tracking-widest mb-1">
            45-MAKTAB · SUN'IY INTELLEKT KURSI
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-orbitron text-white">
            YAGONA TIZIMGA KIRISH
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ustoz yoki o'quvchi o'z shaxsiy login va parolini kiritsin
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Single Universal Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono-code text-slate-300 mb-1">
              Login (Username)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Loginingizni kiriting..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono-code"
                required
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-code text-slate-300 mb-1">
              Maxfiy Parol
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Parolingizni kiriting..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-10 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono-code"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer mt-2"
          >
            <span>Tizimga Kirish</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {allowClose && onClose && (
          <div className="mt-4 text-center">
            <button
              onClick={onClose}
              className="text-xs text-slate-500 hover:text-slate-300 underline cursor-pointer"
            >
              Yopish
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
