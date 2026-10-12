import React, { useState, useEffect } from 'react';
import { ActiveTab, UserRole, Student } from '../types';
import { ShieldCheck, Cpu, Clock, LogOut, Key, User, DollarSign } from 'lucide-react';

interface TopNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  role: UserRole;
  isAuthenticated: boolean;
  onLogout: () => void;
  onOpenLogin: () => void;
  activeStudent: Student | null;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  role,
  isAuthenticated,
  onLogout,
  onOpenLogin,
  activeStudent,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('uz-UZ', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-[#060918]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
        
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Cpu className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
          </div>
          <button
            onClick={() => setActiveTab(role === 'admin' ? 'overview' : 'portal')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="font-orbitron tracking-wider text-sm sm:text-lg font-bold text-white group-hover:text-cyan-400 transition-colors whitespace-nowrap">
              45-MAKTAB <span className="text-cyan-400 glow-cyan">AI OS</span>
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Faqat tizimga kirilganda ko'rinadi) */}
        {isAuthenticated && (
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {role === 'admin' ? (
              <>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'overview'
                      ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 pb-1'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'attendance'
                      ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 pb-1'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Davomat
                </button>
                <button
                  onClick={() => setActiveTab('students')}
                  className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'students'
                      ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 pb-1'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  O'quvchilar & Login
                </button>
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 ${
                    activeTab === 'payments'
                      ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 pb-1'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Oylik To'lovlar</span>
                </button>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'schedule'
                      ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 pb-1'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  72 Dars Reja & Vazifalar
                </button>
                <button
                  onClick={() => setActiveTab('certificate')}
                  className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'certificate'
                      ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 pb-1'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sertifikat Generatori
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('portal')}
                  className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'portal'
                      ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 pb-1'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Mening Kabinetim
                </button>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'schedule'
                      ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 pb-1'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  72 Soatlik Dars Rejasi & Vazifalar
                </button>
                <button
                  onClick={() => setActiveTab('certificate')}
                  className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'certificate'
                      ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 pb-1'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Bitiruv Sertifikatim
                </button>
              </>
            )}
          </nav>
        )}

        {/* Zone 3: HUD Clock, User badge & Prominent Chiqish Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/80 border border-slate-700/60 text-xs font-mono-code text-cyan-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{currentTime || '12:00:00'}</span>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono-code">
                {role === 'admin' ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300 font-semibold">Ustoz M.Xo'jayev</span>
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-cyan-200 font-semibold truncate max-w-[120px]">
                      {activeStudent?.fullName.split(' ')[0]}
                    </span>
                  </>
                )}
              </div>

              {/* ULTRA-PROMINENT CHIQISH (LOGOUT) BUTTON */}
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-red-600 hover:bg-red-500 border border-red-400 text-white text-xs sm:text-sm font-bold transition-all shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:shadow-[0_0_22px_rgba(239,68,68,0.8)] cursor-pointer whitespace-nowrap shrink-0"
                title="Tizimdan chiqish"
              >
                <LogOut className="w-4 h-4 text-white" />
                <span className="font-semibold">Chiqish</span>
              </button>
            </div>
          ) : (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-[11px] font-mono-code text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Avtorizatsiya oynasi</span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Secondary Navigation Row (Faqat tizimga kirilganda) */}
      {isAuthenticated && (
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto px-4 py-2 border-t border-slate-800/80 bg-slate-950/60 text-xs">
          {role === 'admin' ? (
            <>
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                  activeTab === 'overview' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('attendance')}
                className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                  activeTab === 'attendance' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
                }`}
              >
                Davomat
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                  activeTab === 'students' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
                }`}
              >
                O'quvchilar
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                  activeTab === 'payments' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
                }`}
              >
                Oylik To'lov
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                  activeTab === 'schedule' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
                }`}
              >
                72 Dars Reja
              </button>
              <button
                onClick={() => setActiveTab('certificate')}
                className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                  activeTab === 'certificate' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
                }`}
              >
                Sertifikat
              </button>
              <button
                onClick={onLogout}
                className="ml-auto px-3 py-1 rounded-md bg-red-600/30 hover:bg-red-600/50 border border-red-500/80 text-red-200 text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1 shadow-[0_0_10px_rgba(239,68,68,0.3)] cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span>Chiqish</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('portal')}
                className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                  activeTab === 'portal' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
                }`}
              >
                Mening Kabinetim
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                  activeTab === 'schedule' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
                }`}
              >
                72 Dars Reja & Vazifalar
              </button>
              <button
                onClick={() => setActiveTab('certificate')}
                className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                  activeTab === 'certificate' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
                }`}
              >
                Sertifikat
              </button>
              <button
                onClick={onLogout}
                className="ml-auto px-3 py-1 rounded-md bg-red-600/30 hover:bg-red-600/50 border border-red-500/80 text-red-200 text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1 shadow-[0_0_10px_rgba(239,68,68,0.3)] cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span>Chiqish</span>
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
