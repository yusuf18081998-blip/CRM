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
      if (perm === 'granted') {
        showSystemNotification({
          title: "45-Maktab Bildirishnomalari Faollashdi! 🔔",
          body: "Saytdan tashqarida bo'lsangiz ham yangi vazifalar va baholar ekranga chiqadi.",
          type: 'success',
        });
      }
    } catch {
      // ignore
    }

    setIsRequesting(false);
    onAllow();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg cyber-glass rounded-2xl border-2 border-cyan-500/60 p-5 sm:p-7 shadow-[0_0_60px_rgba(6,182,212,0.35)] text-left overflow-hidden">
        {/* Glow ambient background accents */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header with Icon & Tag */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-amber-500 p-0.5 shadow-lg shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative">
                <Bell className="w-6 h-6 text-amber-400 animate-bounce" />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500" />
                </span>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[10px] font-mono-code text-cyan-300">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>SAYTGA KIRISH · BILDIRISHNOMA SOZLAMASI</span>
              </div>
              <h3 className="text-lg sm:text-xl font-orbitron font-extrabold text-white mt-1 tracking-wide">
                2-Rasmdagidek Bildirishnomani Yoqing!
              </h3>
            </div>
          </div>
        </div>

        {/* Clear instruction text including external background capability */}
        <div className="mb-3 p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-slate-200">
          <div className="flex items-center gap-2 text-cyan-300 font-bold mb-1">
            <Laptop className="w-4 h-4 text-cyan-400" />
            <span>Saytdan tashqarida turganda ham chiqadi!</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Brauzerni minimallashtirsangiz yoki boshqa ilovada bo&apos;lsangiz ham, yangi amaliy vazifa, baho yoki to&apos;lov eslatmasi (har oyning 5-sanasigacha) chiqqanda ekranda tizim xabarnomasi va yoqimli qo&apos;ng&apos;iroq ohangi chiqadi (nutqsiz).
          </p>
        </div>

        {/* 2-RASM ILUSTRATSIYASI (Browser Notification Prompt Mockup) */}
        <div className="mb-3 rounded-xl bg-slate-950/90 border-2 border-amber-500/50 p-3 sm:p-4 shadow-inner relative overflow-hidden">
          <div className="flex items-center justify-between text-[11px] font-mono-code text-amber-400 font-bold mb-2 pb-1.5 border-b border-slate-800">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>2-RASMDEK BRAUZER RUXSATINI YOQISH TARTIBI:</span>
            </span>
            <span className="text-slate-400 text-[10px]">Windows / Chrome / Android</span>
          </div>

          {/* Browser Address Bar Mockup */}
          <div className="rounded-lg bg-slate-900 border border-slate-800 p-2 flex items-center gap-2 mb-2 text-xs">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-mono-code text-slate-300 text-[11px] truncate">
              https://maktab45-ai.uz
            </span>
            <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono-code">
              Xavfsiz
            </span>
          </div>

          {/* Browser Permission Prompt Dialog */}
          <div className="rounded-xl bg-slate-900/95 border border-cyan-500/50 p-3 shadow-lg">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-cyan-400/50 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_12px_rgba(6,182,212,0.35)] p-0.5">
                <SchoolLogo size="sm" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span>maktab45-ai.uz</span>
                  <span className="text-[10px] text-slate-400 font-normal">bildirishnoma yubormoqchi:</span>
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  &ldquo;Yangi vazifalar va baholarni ko&apos;rsatish uchun ruxsat berilsinmi?&rdquo;
                </div>
              </div>
            </div>

            {/* Prompt Buttons with Pointer Arrow pointing to "Ruxsat berish" */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-end gap-2">
              <div className="hidden sm:flex items-center gap-1 text-[11px] text-amber-300 font-bold font-mono-code mr-auto animate-pulse">
                <span>👉 2-rasmdagi ushbu tugmani bosing:</span>
              </div>
              <span className="px-2.5 py-1 rounded text-[11px] text-slate-400 bg-slate-800">
                Bloklash
              </span>
              <div className="relative">
                <span className="px-3.5 py-1 rounded bg-blue-600 text-white font-bold text-xs shadow-md border border-blue-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  Ruxsat berish (Allow)
                </span>
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Browser Permission Status Indicator */}
        <div className="mb-3 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {browserPerm === 'granted' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span className="text-slate-300 text-[11px]">
              Brauzer holati:{' '}
              {browserPerm === 'granted' ? (
                <strong className="text-emerald-400">Ruxsat berilgan (Faol)</strong>
              ) : browserPerm === 'denied' ? (
                <strong className="text-rose-400">Bloklangan (Qulf belgisidan oching)</strong>
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
            <span>Alohida oynada ochish</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Audio & Outside Test Row */}
        <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
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
              className="px-2 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1"
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
                <div className="text-xs font-bold text-white truncate">Saytdan tashqarida</div>
                <div className="text-[10px] text-amber-400 font-mono-code truncate">
                  {countdown !== null ? `⏳ ${countdown} soniya...` : "Fonda sinash (5s)"}
                </div>
              </div>
            </div>
            <button
              type="button"
              disabled={countdown !== null}
              onClick={handleTestOutside}
              className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
            >
              {countdown !== null ? `${countdown}s` : "Fonda sinash"}
            </button>
          </div>
        </div>

        {countdown !== null && (
          <div className="mb-3 p-2 rounded-lg bg-amber-950/60 border border-amber-500/50 text-[11px] text-amber-300 animate-pulse text-center font-mono-code">
            ⚡ Brauzerni minimallashtiring yoki boshqa dasturga o&apos;ting! {countdown} soniyadan keyin tashqi ekran xabari va qo&apos;ng&apos;iroq chiqadi...
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <button
            type="button"
            disabled={isRequesting}
            onClick={handleAllowClick}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer active:scale-[0.99]"
          >
            <Check className="w-4 h-4 text-emerald-300" />
            <span>2-rasmdagidek Ruxsat Berish (Yoqish)</span>
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

        <p className="text-[10px] text-slate-500 font-mono-code mt-3 text-center">
          * Ushbu sozlamani istalgan vaqt yuqori menyudagi 🔔 tugmasi orqali qayta yoqishingiz yoki o&apos;chirishingiz mumkin.
        </p>
      </div>
    </div>
  );
};
