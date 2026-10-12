import React from 'react';
import { Student, AttendanceRecord, Homework, StudentSubmission, ActiveTab } from '../types';
import { Users, Award, BookOpen, Calendar, CheckCircle2, TrendingUp, Sparkles, ChevronRight, ArrowUpRight, LogOut } from 'lucide-react';

interface DashboardStatsProps {
  students: Student[];
  attendance: AttendanceRecord[];
  homework: Homework[];
  submissions: StudentSubmission[];
  completedLessons?: number[];
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddStudent: () => void;
  onLogout?: () => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  students,
  attendance,
  homework,
  submissions,
  completedLessons = [1, 2, 3, 4, 5, 6, 7, 8, 9],
  setActiveTab,
  onOpenAddStudent,
  onLogout,
}) => {
  // Calculate average attendance
  let totalPresentCount = 0;
  let totalRecordsCount = 0;

  attendance.forEach((att) => {
    Object.values(att.records).forEach((status) => {
      totalRecordsCount++;
      if (status === 'present') totalPresentCount++;
    });
  });

  const avgAttendancePercent = totalRecordsCount > 0
    ? Math.round((totalPresentCount / totalRecordsCount) * 100)
    : 100;

  // Paid students count (Current month oktyabr)
  const paidCount = students.filter(
    (s) => s.monthlyPayments?.['oktyabr']?.status === 'paid' || s.monthlyPayments?.['oktyabr']?.status === 'scholarship' || s.scholarshipReason
  ).length;
  const paymentRate = students.length > 0 ? Math.round((paidCount / students.length) * 100) : 100;

  // Homework submission rate
  const totalPossibleSubmissions = students.length * homework.length;
  const gradedOrPendingSubmissions = submissions.length;
  const homeworkRate = totalPossibleSubmissions > 0
    ? Math.round((gradedOrPendingSubmissions / totalPossibleSubmissions) * 100)
    : 0;

  // Calculate top students leaderboard
  const studentRankings = students.map((st) => {
    // Attendance count
    let attended = 0;
    let totalDarslar = 0;
    attendance.forEach((rec) => {
      totalDarslar++;
      if (rec.records[st.id] === 'present') attended++;
    });
    const attPct = totalDarslar > 0 ? Math.round((attended / totalDarslar) * 100) : 100;

    // Submissions score average
    const stSubs = submissions.filter((sub) => sub.studentId === st.id && sub.score !== undefined);
    const avgScore = stSubs.length > 0
      ? Math.round(stSubs.reduce((acc, curr) => acc + (curr.score || 0), 0) / stSubs.length)
      : 85;

    const overallScore = Math.round(attPct * 0.4 + avgScore * 0.6);

    return {
      student: st,
      attendancePercent: attPct,
      averageScore: avgScore,
      overallScore,
      submissionsCount: stSubs.length
    };
  }).sort((a, b) => b.overallScore - a.overallScore);

  const latestLesson = attendance[attendance.length - 1];

  return (
    <div className="space-y-8">
      {/* Hero OS Glass Banner */}
      <div className="cyber-glass rounded-xl p-6 sm:p-8 relative overflow-hidden border border-cyan-500/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>45-MAKTAB STEM & AI LAB</span>
              <span aria-hidden="true">·</span>
              <span>2026-O'QUV YILI</span>
              <span aria-hidden="true">·</span>
              <span>YAGONA MAXSUS KURS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3">
              Sun'iy Intellekt <span className="text-cyan-400 glow-cyan">Boshqaruv Tizimi</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              45-maktab iqtidorli o'quvchilari uchun Ustoz M.Xo'jayev boshchiligidagi 72 soatlik maxsus Sun'iy intellekt kursi (ChatGPT, Midjourney, ElevenLabs, Runway, Telegram Bot va Loyihalar) kiber monitoring ekotizimi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('attendance')}
              className="px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Davomatni Belgilash</span>
            </button>
            <button
              onClick={onOpenAddStudent}
              className="px-4 py-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 font-medium text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Yangi O'quvchi</span>
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:shadow-[0_0_22px_rgba(239,68,68,0.7)] flex items-center gap-2 cursor-pointer"
                title="Tizimdan chiqish"
              >
                <LogOut className="w-4 h-4 text-white" />
                <span>Chiqish</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="cyber-glass-card rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Jami O'quvchilar</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono-code mb-1">
            {students.length}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-emerald-400 font-medium">{students.length} faol</span>
            <span aria-hidden="true">·</span>
            <span>45-maktab 5-11 sinflar</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="cyber-glass-card rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">O'rtacha Davomat</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono-code mb-1">
            {avgAttendancePercent}%
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-cyan-400 font-medium">{attendance.length} ta dars</span>
            <span aria-hidden="true">·</span>
            <span>O'quv rejasida 24 ta</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="cyber-glass-card rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Vazifalar Natijasi</span>
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono-code mb-1">
            {homeworkRate}%
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-blue-400 font-medium">{submissions.length} topshirildi</span>
            <span aria-hidden="true">·</span>
            <span>{homework.length} ta amaliy laboratoriya</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="cyber-glass-card rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">To'lov / Grant Qamrovi</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono-code mb-1">
            {paymentRate}%
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-amber-400 font-medium">
              {students.filter(s => s.monthlyPayments?.['oktyabr']?.status === 'scholarship' || s.scholarshipReason).length} ta grant
            </span>
            <span aria-hidden="true">·</span>
            <span>Oylik monitoring</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Latest Lesson Status & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Recent Activity & Curriculum Track */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Lesson HUD */}
          <div className="cyber-glass rounded-xl p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-cyan-400 font-mono-code mb-1">OXIRGI BO'LIB O'TGAN DARS</div>
                <h2 className="text-lg font-bold text-white">
                  {latestLesson ? `${latestLesson.lessonNumber}-Dars: ${latestLesson.lessonTopic}` : 'Dars rejalashtirilmoqda'}
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('attendance')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Davomat jurnali</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {latestLesson ? (
              <div className="bg-slate-900/70 rounded-lg p-4 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span>Sana: <strong className="text-slate-200">{latestLesson.date}</strong></span>
                  <span>Ishtirok: <strong className="text-emerald-400">
                    {Object.values(latestLesson.records).filter(r => r === 'present').length} / {students.length} o'quvchi
                  </strong></span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800">
                  {students.slice(0, 8).map((st) => {
                    const stStatus = latestLesson.records[st.id] || 'present';
                    return (
                      <div
                        key={st.id}
                        className="flex items-center justify-between p-2 rounded bg-slate-950/50 border border-slate-800 text-xs"
                      >
                        <span className="truncate text-slate-300 font-medium">{st.fullName.split(' ')[0]}</span>
                        <span className={`text-[10px] font-mono-code font-bold px-1.5 py-0.5 rounded ${
                          stStatus === 'present'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : stStatus === 'excused'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {stStatus === 'present' ? 'Keldi' : stStatus === 'excused' ? 'Sababli' : 'Kelmadi'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/50 rounded-lg p-6 border border-dashed border-slate-800 text-center">
                <p className="text-xs text-slate-400 mb-3">
                  Hozircha darslar bo'yicha davomat kiritilmagan.
                </p>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/30 cursor-pointer transition-colors"
                >
                  + Dars o'tish va davomat belgilash
                </button>
              </div>
            )}
          </div>

          {/* AI Roadmap 4 Quarters from 72-Hour Curriculum */}
          <div className="cyber-glass rounded-xl p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <span>72 Soatlik Yillik Reja Bosqichlari (4 Chorak)</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono-code">36 HAFTA · 72 DARS</span>
            </div>

            <div className="space-y-3">
              {(() => {
                const q1 = completedLessons.filter((n) => n >= 1 && n <= 18).length;
                const q2 = completedLessons.filter((n) => n >= 19 && n <= 34).length;
                const q3 = completedLessons.filter((n) => n >= 35 && n <= 54).length;
                const q4 = completedLessons.filter((n) => n >= 55 && n <= 72).length;

                const modules = [
                  {
                    num: '1-CH',
                    title: '1-Chorak: Prompt Engineering & Matnli AI',
                    desc: '1-18 darslar: ChatGPT, Claude, Gemini, Aniq topshiriq va Nazorat ishi',
                    status: q1 >= 18 ? "Yakunlandi (18/18)" : q1 > 0 ? `O'tilmoqda (${q1}/18)` : "Kutilmoqda",
                    progress: Math.round((q1 / 18) * 100),
                  },
                  {
                    num: '2-CH',
                    title: '2-Chorak: Generativ Dizayn & Vizual AI',
                    desc: '19-34 darslar: Midjourney, DALL-E 3, Leonardo AI, Canva AI, Inpainting',
                    status: q2 >= 16 ? "Yakunlandi (16/16)" : q2 > 0 ? `O'tilmoqda (${q2}/16)` : "Kutilmoqda",
                    progress: Math.round((q2 / 16) * 100),
                  },
                  {
                    num: '3-CH',
                    title: '3-Chorak: Audio, Video & Avtomatlashtirish',
                    desc: '35-54 darslar: ElevenLabs, Runway, HeyGen, Gamma.app, Code AI, Excel AI',
                    status: q3 >= 20 ? "Yakunlandi (20/20)" : q3 > 0 ? `O'tilmoqda (${q3}/20)` : "Kutilmoqda",
                    progress: Math.round((q3 / 20) * 100),
                  },
                  {
                    num: '4-CH',
                    title: '4-Chorak: Telegram Bot & Yillik Loyiha Himoyasi',
                    desc: '55-72 darslar: No-code bot, AI etikasi, Deepfake savodxonligi, Loyiha himoyasi',
                    status: q4 >= 18 ? "Yakunlandi (18/18)" : q4 > 0 ? `O'tilmoqda (${q4}/18)` : "Kutilmoqda",
                    progress: Math.round((q4 / 18) * 100),
                  },
                ];

                return modules.map((mod) => (
                  <div
                    key={mod.num}
                    className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-12 h-8 rounded bg-slate-800 flex items-center justify-center font-mono-code text-cyan-400 text-xs font-bold shrink-0">
                        {mod.num}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-slate-200">{mod.title}</div>
                        <div className="text-xs text-slate-400">{mod.desc}</div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-xs font-mono-code font-semibold px-2 py-0.5 rounded ${
                        mod.status.includes("Yakunlandi")
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : mod.status.includes("O'tilmoqda")
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {mod.status}
                      </span>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>

        {/* Right Column: Top Students Leaderboard */}
        <div className="space-y-6">
          <div className="cyber-glass rounded-xl p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Yetakchilar Reytingi</span>
              </h2>
              <button
                onClick={() => setActiveTab('students')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Barchasi</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {studentRankings.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                <Users className="w-8 h-8 text-cyan-400/40 mx-auto mb-2" />
                <p className="font-semibold text-slate-300">O'quvchilar bazasi bo'sh</p>
                <p className="text-slate-500 mt-1">O'quvchilarni qo'shsangiz reyting avtomatik shakllanadi.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {studentRankings.slice(0, 6).map((item, index) => (
                  <div
                    key={item.student.id}
                    className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono-code ${
                        index === 0
                          ? 'bg-amber-400 text-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                          : index === 1
                          ? 'bg-slate-300 text-slate-950'
                          : index === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {index + 1}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-slate-200">
                          {item.student.fullName}
                        </div>
                        <div className="text-xs text-slate-400 font-mono-code">
                          Davomat: {item.attendancePercent}% · Uy vazifa: {item.averageScore} ball
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold font-mono-code text-cyan-400">
                        {item.overallScore}
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                        Ko'rsatkich
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 pt-4 border-t border-slate-800">
              <button
                onClick={() => setActiveTab('certificate')}
                className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Bitiruv Sertifikatlarini Generatsiya Qilish</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
