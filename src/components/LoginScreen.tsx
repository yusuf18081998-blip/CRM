import React, { useState } from 'react';
import { Student, UserRole } from '../types';
import { TEACHER_CREDENTIALS } from '../data/initialData';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Shield,
  GraduationCap,
  Bell,
} from 'lucide-react';
import { SchoolLogo } from './SchoolLogo';

interface LoginScreenProps {
  students: Student[];
  onLoginSuccess: (role: UserRole, student?: Student) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  students,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setErrorMessage("Iltimos, login va parolni kiriting!");
      return;
    }

    setIsLoading(true);

    // 1. O'qituvchi (Ustoz / Admin) tekshiruvi
    const isTeacherUser = TEACHER_CREDENTIALS.validUsernames.includes(cleanUser);
    const isTeacherPass = TEACHER_CREDENTIALS.validPasswords.includes(cleanPass);

    if (isTeacherUser && isTeacherPass) {
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess('admin');
      }, 200);
      return;
    }

    // 2. O'quvchi (5-11 sinf) tekshiruvi
    const foundStudent = students.find(
      (s) => s.username.toLowerCase() === cleanUser && s.password === cleanPass
    );

    if (foundStudent) {
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess('student', foundStudent);
      }, 200);
      return;
    }

    // 3. Login yoki parol xato
    setTimeout(() => {
      setIsLoading(false);
      setErrorMessage("Login yoki maxfiy parol noto'g'ri kiritildi! Iltimos, tekshirib qayta kiriting.");
    }, 200);
  };

  return (
    <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-16">
      {/* Yuqori sarlavha va belgi */}
      <div className="text-center mb-6 sm:mb-8 max-w-lg mx-auto flex flex-col items-center">
        <div className="mb-3 p-3 rounded-2xl bg-cyan-950/70 border border-cyan-400/50 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
          <SchoolLogo size="lg" />
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono-code mb-4 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>45-MAKTAB · 5-11 SINFLAR SUN'IY INTELLEKT KURSI</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-orbitron text-white tracking-tight">
          TIZIMGA <span className="text-cyan-400 glow-cyan">KIRISH</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          O'qituvchi va o'quvchilar uchun yagona kirish oynasi
        </p>
      </div>

      {/* Asosiy yagona kirish kartasi */}
      <div className="w-full max-w-md cyber-glass rounded-2xl border border-cyan-500/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Orqa fon nur effekti */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-12 -mt-12" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -ml-10 -mb-10" />

        {/* Xatolik xabari */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs flex items-center gap-2.5 font-medium animate-shake shadow-[0_0_15px_rgba(244,63,94,0.25)]">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Yagona Kirish Formasi */}
        <form onSubmit={handleLogin} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-mono-code text-slate-300 mb-1.5">
              Login (Foydalanuvchi nomi)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Loginingizni kiriting..."
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono-code transition-all"
                required
                autoFocus
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-code text-slate-300 mb-1.5">
              Maxfiy Parol
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Parolingizni kiriting..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono-code transition-all"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                title={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Tizimga Kirish tugmasi */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.45)] hover:shadow-[0_0_25px_rgba(6,182,212,0.65)] cursor-pointer mt-3"
          >
            <span>{isLoading ? "Tekshirilmoqda..." : "Tizimga Kirish"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Tizim haqida ixcham ma'lumot */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col items-center gap-2.5 text-[11px] text-slate-400 font-mono-code">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>O'qituvchi paneli</span>
            </div>
            <span className="text-slate-600">·</span>
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
              <span>O'quvchi kabineti</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400/90 text-[10px]">
            <Bell className="w-3 h-3 text-amber-400 animate-bounce" />
            <span>Yangi vazifalar & baholarda audio qo'ng'iroq yangraydi</span>
          </div>
        </div>
      </div>

      {/* Cyber OS pastki ma'lumot */}
      <div className="mt-8 text-center text-xs text-slate-500 font-mono-code flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
        <span>45-MAKTAB · SUN'IY INTELLEKT LABORATORIYASI (72 SOAT)</span>
      </div>
    </div>
  );
};
