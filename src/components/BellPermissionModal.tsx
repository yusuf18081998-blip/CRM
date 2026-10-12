import React, { useState, useEffect } from 'react';
import {
  Bell,
  Volume2,
  Sparkles,
  Check,
  VolumeX,
  Play,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Laptop,
  AlertCircle,
  X,
} from 'lucide-react';
import { SchoolLogo } from './SchoolLogo';
import {
  playBellSound,
  requestBrowserNotificationPermission,
  showSystemNotification,
} from '../utils/audioNotification';

interface BellPermissionModalProps {
  isOpen: boolean;
  onAllow: () => void;
  onDeny: () => void;
}

export const BellPermissionModal: React.FC<BellPermissionModalProps> = ({
  isOpen,
  onAllow,
  onDeny,
}) => {
  const [hasTested, setHasTested] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [browserPerm, setBrowserPerm] = useState<string>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setBrowserPerm(Notification.permission);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestSound = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Pure melodic chime, no voice/speech
    playBellSound('grade');
    setHasTested(true);
  };

  const handleTestOutside = async () => {
    // 1. Ensure permission is requested
    const perm = await requestBrowserNotificationPermission();
    setBrowserPerm(perm);

    // 2. Start countdown for 5 seconds so user can switch tabs or minimize
    setCountdown(5);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          // Fire external system notification banner & chime
          showSystemNotification({
            title: "45-Maktab Cyber OS: Yangi Baho! ⭐",
            body: "Saytdan tashqarida tursangiz ham tizim bildirishnomasi va qo'ng'iroq ohangi chiqdi!",
            type: 'grade',
          });
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAllowClick = async () => {
    setIsRequesting(true);
    // 1. Play crystal bell chime
    playBellSound('success');

    // 2. Request native browser notification permission for background/external delivery
    try {
      const perm = await requestBrowserNotificationPermission();
      setBrowserPerm(perm);
    } catch {
      // ignore
    }

    setIsRequesting(false);
    onAllow();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[88dvh] overflow-y-auto flex flex-col cyber-glass rounded-2xl border-2 border-cyan-500/60 p-4 sm:p-6 shadow-[0_0_60px_rgba(6,182,212,0.35)] text-left">
        {/* Glow ambient background accents */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header with Icon, Tag & Close Button */}
        <div className="flex items-start justify-between gap-3 mb-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-amber-500 p-0.5 shadow-lg shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative">
                <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 animate-bounce" />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500" />
                </span>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[10px] font-mono-code text-cyan-300">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>BILDIRISHNOMA VA OVOZ SOZLAMALARI</span>
              </div>
              <h3 className="text-base sm:text-xl font-orbitron font-extrabold text-white mt-1 tracking-wide">
                Qo&apos;ng&apos;iroq va Xabarlarni Yoqish 🔔
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onDeny}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Yopish (Keyinroq)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clear instruction text including external background capability */}
        <div className="mb-3 p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-slate-200 relative z-10">
          <div className="flex items-center gap-2 text-cyan-300 font-bold mb-1">
            <Laptop className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Saytdan tashqarida turganda ham yangraydi</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Telefoningizda yoki kompyuterda boshqa ilovalarga o&apos;tsangiz ham, yangi amaliy topshiriqlar, baholar va to&apos;lov eslatmalari chiqqanda tizim bildirishnomasi va yoqimli qo&apos;ng&apos;iroq ohangi yangraydi.
          </p>
        </div>

        {/* How to enable instructions */}
        <div className="mb-3 rounded-xl bg-slate-950/90 border border-cyan-500/40 p-3 sm:p-4 shadow-inner relative z-10">
          <div className="flex items-center justify-between text-[11px] font-mono-code text-cyan-300 font-bold mb-2 pb-1.5 border-b border-slate-800">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>BRAUZER BILDIRISHNOMASINI YOQISH TARTIBI:</span>
            </span>
            <span className="text-slate-400 text-[10px]">Android / iOS / Chrome</span>
          </div>

          {/* Browser Permission Prompt Dialog */}
          <div className="rounded-xl bg-slate-900/95 border border-cyan-500/50 p-2.5 sm:p-3 shadow-lg">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-cyan-400/50 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_12px_rgba(6,182,212,0.35)] p-0.5">
                <SchoolLogo size="sm" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span>45-Maktab Cyber OS</span>
                  <span className="text-[10px] text-slate-400 font-normal">bildirishnoma yubormoqchi:</span>
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  &ldquo;Yangi vazifalar, baholar va eslatmalarni ko&apos;rsatish uchun ruxsat berasizmi?&rdquo;
                </div>
              </div>
            </div>

            {/* Prompt Buttons with Pointer Arrow pointing to "Ruxsat berish" */}
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-end gap-2">
              <div className="text-[10px] sm:text-[11px] text-amber-300 font-bold font-mono-code mr-auto">
                <span>👉 So&apos;rov chiqqanda tanlang:</span>
              </div>
              <div className="relative">
                <span className="px-3 py-1 rounded bg-blue-600 text-white font-bold text-xs shadow-md border border-blue-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  Ruxsat berish (Allow)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Browser Permission Status Indicator */}
        <div className="mb-3 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs relative z-10">
          <div className="flex items-center gap-2">
            {browserPerm === 'granted' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span className="text-slate-300 text-[11px]">
              Holat:{' '}
              {browserPerm === 'granted' ? (
                <strong className="text-emerald-400">Ruxsat berilgan (Faol)</strong>
              ) : browserPerm === 'denied' ? (
                <strong className="text-rose-400">Bloklangan (Brauzer sozlamalaridan oching)</strong>
              ) : (
                <strong className="text-amber-400">Ruxsat kutilmoqda</strong>
              )}
            </span>
          </div>

          <a
            href={typeof window !== 'undefined' ? window.location.href : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono-code underline flex items-center gap-1"
            title="Alohida oynada ochish"
          >
            <span>Alohida ochish</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Audio & Outside Test Row */}
        <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-left relative z-10">
          {/* Test 1: Chime Ohang Sinovi */}
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Volume2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">Qo&apos;ng&apos;iroq ohangi</div>
                <div className="text-[10px] text-slate-400 font-mono-code truncate">
                  {hasTested ? "✅ Ohang yangradi" : "Ohangni eshitish"}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleTestSound}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Sinash</span>
            </button>
          </div>

          {/* Test 2: Outside / Background Test (5 seconds timer) */}
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <ExternalLink className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">Fonda sinash</div>
                <div className="text-[10px] text-amber-400 font-mono-code truncate">
                  {countdown !== null ? `⏳ ${countdown} soniya...` : "Saytdan tashqarida (5s)"}
                </div>
              </div>
            </div>
            <button
              type="button"
              disabled={countdown !== null}
              onClick={handleTestOutside}
              className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
            >
              {countdown !== null ? `${countdown}s` : "Fonda sinash"}
            </button>
          </div>
        </div>

        {countdown !== null && (
          <div className="mb-3 p-2 rounded-lg bg-amber-950/60 border border-amber-500/50 text-[11px] text-amber-300 animate-pulse text-center font-mono-code relative z-10">
            ⚡ Brauzerni minimallashtiring yoki boshqa dasturga o&apos;ting! {countdown} soniyadan keyin tashqi ekran xabari va qo&apos;ng&apos;iroq chiqadi...
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 mt-1 relative z-10">
          <button
            type="button"
            disabled={isRequesting}
            onClick={handleAllowClick}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer active:scale-[0.99]"
          >
            <Check className="w-4 h-4 text-emerald-300" />
            <span>Qo&apos;ng&apos;iroq va Bildirishnomani Yoqish</span>
            <ArrowRight className="w-4 h-4 text-cyan-200" />
          </button>

          <button
            type="button"
            onClick={onDeny}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 py-3 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
          >
            <VolumeX className="w-3.5 h-3.5" />
            <span>Keyinroq</span>
          </button>
        </div>

        <p className="text-[10px] text-slate-500 font-mono-code mt-3 text-center relative z-10">
          * Istalgan vaqt yuqori menyudagi 🔔 belgisi orqali qayta yoqishingiz yoki o&apos;chirishingiz mumkin.
        </p>
      </div>
    </div>
  );
};
