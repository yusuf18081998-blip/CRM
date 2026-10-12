import React, { useEffect } from 'react';
import { AppToast } from '../types';
import {
  Award,
  BookOpen,
  CheckCircle,
  Info,
  AlertTriangle,
  X,
  Volume2,
} from 'lucide-react';
import { playBellSound } from '../utils/audioNotification';
import { SchoolLogo } from './SchoolLogo';

interface ToastContainerProps {
  toasts: AppToast[];
  onDismiss: (id: string) => void;
}

// Saytning o'zida ichki toastlar chiqmasligi uchun null qaytariladi.
// Bildirishnomalar faqat va faqat Chrome tizim xabarnomasi orqali chiqadi.
export const ToastContainer: React.FC<ToastContainerProps> = () => {
  return null;
};

const ToastItem: React.FC<{ toast: AppToast; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 6500);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const getAccent = () => {
    switch (toast.type) {
      case 'grade':
        return {
          border: 'border-amber-500/60 shadow-[0_10px_35px_rgba(245,158,11,0.25)]',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          topBar: 'bg-gradient-to-r from-amber-500 to-yellow-400',
          icon: <Award className="w-5 h-5 text-amber-300" />,
          category: 'BAHO BARKAMOL',
        };
      case 'homework':
        return {
          border: 'border-cyan-500/60 shadow-[0_10px_35px_rgba(6,182,212,0.25)]',
          badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          topBar: 'bg-gradient-to-r from-cyan-500 to-blue-500',
          icon: <BookOpen className="w-5 h-5 text-cyan-300" />,
          category: 'YANGI VAZIFA',
        };
      case 'success':
        return {
          border: 'border-emerald-500/60 shadow-[0_10px_35px_rgba(16,185,129,0.25)]',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          topBar: 'bg-gradient-to-r from-emerald-500 to-teal-400',
          icon: <CheckCircle className="w-5 h-5 text-emerald-300" />,
          category: 'MUVAFFAQIYAT',
        };
      case 'warning':
        return {
          border: 'border-rose-500/60 shadow-[0_10px_35px_rgba(244,63,94,0.25)]',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          topBar: 'bg-gradient-to-r from-rose-500 to-red-500',
          icon: <AlertTriangle className="w-5 h-5 text-rose-300" />,
          category: 'OGOHLANTIRISH',
        };
      default:
        return {
          border: 'border-blue-500/50 shadow-[0_10px_30px_rgba(59,130,246,0.2)]',
          badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          topBar: 'bg-gradient-to-r from-blue-500 to-indigo-500',
          icon: <Info className="w-5 h-5 text-blue-300" />,
          category: 'BILDIRISHNOMA',
        };
    }
  };

  const accent = getAccent();

  const handlePlaySound = () => {
    // Only play chime, no talking (ovoz chiqarsa bo'ldi, gapirmasin)
    const soundType =
      toast.type === 'grade' ||
      toast.type === 'homework' ||
      toast.type === 'success' ||
      toast.type === 'warning'
        ? toast.type
        : 'generic';
    playBellSound(soundType);
  };

  return (
    <div
      role="status"
      className={`pointer-events-auto transform transition-all duration-300 ease-out p-3.5 sm:p-4 rounded-2xl border bg-slate-950/95 backdrop-blur-xl text-white relative overflow-hidden ${accent.border}`}
      style={{
        animation: 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Top slim colored accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${accent.topBar}`} />

      {/* Desktop Notification Header (Chrome / Windows OS style: App name • domain • time) */}
      <div className="flex items-center justify-between text-[11px] font-mono-code text-slate-400 mb-2 pb-1.5 border-b border-slate-800/80">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-4 h-4 rounded bg-slate-900 border border-cyan-400/40 flex items-center justify-center shrink-0 overflow-hidden shadow-[0_0_8px_rgba(6,182,212,0.4)]">
            <SchoolLogo size="xs" glow={false} />
          </div>
          <span className="font-bold text-slate-200 truncate">maktab45-ai.uz</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400 shrink-0">hozir</span>
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-2">
          {/* Quick replay bell chime */}
          <button
            type="button"
            onClick={handlePlaySound}
            className="p-1 rounded text-slate-400 hover:text-amber-300 hover:bg-slate-800/80 transition-colors cursor-pointer"
            title="Qo'ng'iroq ohangini eshitish"
            aria-label="Qo'ng'iroq ohangini eshitish"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
          {/* Close toast button */}
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
            title="Yopish"
            aria-label="Yopish"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Toast Content Body */}
      <div className="flex items-start gap-3">
        {/* Glowing circular icon avatar */}
        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center shrink-0 shadow-md">
          {accent.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase tracking-wider border ${accent.badgeBg}`}
            >
              {accent.category}
            </span>
          </div>

          <h4 className="text-sm font-bold text-white tracking-tight leading-snug">
            {toast.title}
          </h4>

          <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-3">
            {toast.message}
          </p>
        </div>
      </div>
    </div>
  );
};
