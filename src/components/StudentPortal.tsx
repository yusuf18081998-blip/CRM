import React, { useState } from 'react';
import { Student, AttendanceRecord, Homework, StudentSubmission, ActiveTab, MONTH_LIST } from '../types';
import { User, CheckCircle2, Award, BookOpen, Send, ExternalLink, Calendar, ChevronRight, Key, Eye, EyeOff, DollarSign, AlertTriangle, LogOut } from 'lucide-react';

interface StudentPortalProps {
  student: Student | null;
  allStudents: Student[];
  onSelectStudent: (s: Student) => void;
  attendance: AttendanceRecord[];
  homework: Homework[];
  submissions: StudentSubmission[];
  onSubmitHomework: (sub: StudentSubmission) => void;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenCertificateForMe: () => void;
  onLogout?: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  student,
  allStudents,
  onSelectStudent,
  attendance,
  homework,
  submissions,
  onSubmitHomework,
  setActiveTab,
  onOpenCertificateForMe,
  onLogout,
}) => {
  const [submittingHwId, setSubmittingHwId] = useState<string | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!student) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="cyber-glass rounded-2xl p-8 text-center border border-cyan-500/30 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto mb-4 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold font-orbitron text-white mb-2">
            O'QUVCHI KABINETI
          </h2>
          <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
            Hozircha tizimga o'quvchi sifatida kirmagansiz yoki o'quvchilar ro'yxati bo'sh.
            Ustoz tomonidan o'quvchi qo'shilgach, o'quvchi logini orqali kirishingiz mumkin.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('students')}
              className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
            >
              O'quvchilar Ro'yxatini Ko'rish
            </button>
            <button
              onClick={() => setActiveTab('overview')}
              className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
            >
              Boshqaruv Paneliga Qaytish
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate attendance for this student
  let presentCount = 0;
  let totalLessons = 0;

  attendance.forEach((rec) => {
    totalLessons++;
    const status = rec.records[student.id];
    if (status === 'present') presentCount++;
  });

  const attendancePercent = totalLessons > 0
    ? Math.round((presentCount / totalLessons) * 100)
    : 100;

  // Submissions for this student
  const studentSubs = submissions.filter((s) => s.studentId === student.id);
  const gradedSubs = studentSubs.filter((s) => s.score !== undefined);
  const avgScore = gradedSubs.length > 0
    ? Math.round(gradedSubs.reduce((acc, c) => acc + (c.score || 0), 0) / gradedSubs.length)
    : 92;

  // Monthly payments summary
  const paidMonthsCount = MONTH_LIST.filter(
    (m) => student.monthlyPayments?.[m.key]?.status === 'paid'
  ).length;
  const isGrant = Object.values(student.monthlyPayments || {}).some(
    (p) => p.status === 'scholarship'
  );

  const handleQuickSubmit = (e: React.FormEvent, hwId: string) => {
    e.preventDefault();
    if (!submissionUrl.trim()) return;

    const newSub: StudentSubmission = {
      id: `SUB-${Date.now().toString().slice(-4)}`,
      homeworkId: hwId,
      studentId: student.id,
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      content: submissionUrl.trim(),
      status: 'pending',
    };

    onSubmitHomework(newSub);
    setSubmittingHwId(null);
    setSubmissionUrl('');
  };

  return (
    <div className="space-y-6">
      {/* Student Banner */}
      <div className="cyber-glass rounded-xl p-6 border border-cyan-500/30 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 font-orbitron font-extrabold text-2xl shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              {student.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>O'QUVCHI SHAXSIY KABINETI</span>
                <span aria-hidden="true">·</span>
                <span>ID: {student.id}</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {student.fullName}
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                45-Maktab {student.grade} · Ustoz M.Xo'jayev Sun'iy Intellekt Kursi
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Student's credentials badge */}
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-700 font-mono-code text-xs space-y-1">
              <div className="text-[10px] text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                <Key className="w-3 h-3 text-cyan-400" />
                <span>Shaxsiy Kirish Kalitlaringiz:</span>
              </div>
              <div className="text-slate-200">
                login: <strong className="text-cyan-300">@{student.username}</strong>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <span>parol: <strong className="text-amber-300">{showPassword ? student.password : '••••••••'}</strong></span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3.5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 border border-red-400 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] cursor-pointer shrink-0"
                title="Tizimdan chiqish"
              >
                <LogOut className="w-4 h-4 text-white" />
                <span>Chiqish</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4 Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance */}
        <div className="cyber-glass-card rounded-xl p-5 border border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Davomat Ko'rsatkichi</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono-code mb-1">
            {attendancePercent}%
          </div>
          <div className="text-xs text-slate-400">
            {presentCount} ta darsda qatnashgan / {totalLessons} dars
          </div>
        </div>

        {/* GPA / Score */}
        <div className="cyber-glass-card rounded-xl p-5 border border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">O'rtacha Ball</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono-code mb-1">
            {avgScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
          </div>
          <div className="text-xs text-slate-400">
            {gradedSubs.length} ta topshiriq baholandi
          </div>
        </div>

        {/* Homework */}
        <div className="cyber-glass-card rounded-xl p-5 border border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Topshirilgan Ishlar</span>
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono-code mb-1">
            {studentSubs.length} <span className="text-sm font-normal text-slate-400">/ {homework.length}</span>
          </div>
          <div className="text-xs text-slate-400">
            {homework.length - studentSubs.length} ta topshirilmagan vazifa
          </div>
        </div>

        {/* Payment */}
        <div className="cyber-glass-card rounded-xl p-5 border border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">To'lov Holati</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold font-mono-code mb-1">
            {isGrant ? (
              <span className="text-amber-400">100% Maktab Granti</span>
            ) : paidMonthsCount > 0 ? (
              <span className="text-emerald-400">{paidMonthsCount} oy to'langan</span>
            ) : (
              <span className="text-rose-400">To'lov kutilmoqda</span>
            )}
          </div>
          <div className="text-xs text-slate-400">
            {student.scholarshipReason || "Har oy: 100 000 UZS"}
          </div>
        </div>
      </div>

      {/* Monthly Payments Overview Strip */}
      <div className="cyber-glass rounded-xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>Oylik To'lovlarim Tarixi (2026-2027)</span>
          </h2>
          <span className="text-xs font-mono-code text-slate-400">9 OY REJASI (100 000 UZS / OY)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2.5">
          {MONTH_LIST.map((m) => {
            const mPayment = student.monthlyPayments?.[m.key] || { status: 'pending', amount: 100000 };
            const status = mPayment.status;

            return (
              <div
                key={m.key}
                className={`p-3 rounded-lg border flex flex-col justify-between text-xs font-mono-code ${
                  status === 'paid'
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : status === 'scholarship'
                    ? 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                    : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                }`}
              >
                <div className="font-bold text-white mb-1">{m.name}</div>
                <div className="text-[10px]">
                  {status === 'paid' ? (
                    <span className="flex items-center gap-1 font-semibold text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>To'langan</span>
                    </span>
                  ) : status === 'scholarship' ? (
                    <span className="flex items-center gap-1 font-semibold text-amber-400">
                      <Award className="w-3 h-3" />
                      <span>Grant</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 font-semibold text-rose-400">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Kutilmoqda</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content: Attendance History & Homeworks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Attendance Record for this Student */}
        <div className="cyber-glass rounded-xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <span>Shaxsiy Davomat Tarixi</span>
            </h2>
            <span className="text-xs font-mono-code text-cyan-400">
              {attendance.length} TA O'TILGAN DARS
            </span>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {attendance.map((rec) => {
              const status = rec.records[student.id] || 'present';

              return (
                <div
                  key={rec.date}
                  className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-200">
                      {rec.lessonNumber}-dars: {rec.lessonTopic}
                    </div>
                    <div className="text-slate-400 font-mono-code text-[11px] mt-0.5">
                      Sana: {rec.date}
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded text-xs font-mono-code font-bold shrink-0 ${
                    status === 'present'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : status === 'excused'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  }`}>
                    {status === 'present' ? 'Keldi' : status === 'excused' ? 'Sababli' : 'Kelmadi'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Homework & Submissions */}
        <div className="cyber-glass rounded-xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <span>Mening Uy Vazifalarim</span>
            </h2>
            <button
              onClick={() => setActiveTab('schedule')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <span>72 darslik reja</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {homework.map((hw) => {
              const sub = studentSubs.find((s) => s.homeworkId === hw.id);

              return (
                <div
                  key={hw.id}
                  className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-100">{hw.title}</span>
                    <span className="text-slate-400 font-mono-code text-[11px]">
                      Muddati: {hw.dueDate}
                    </span>
                  </div>

                  <p className="text-slate-400 text-[11px] line-clamp-2">
                    {hw.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2">
                    {sub ? (
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-mono-code font-bold">
                          {sub.status === 'graded' ? `${sub.score} ball` : 'Tekshirilmoqda'}
                        </span>
                        {sub.feedback && (
                          <span className="text-slate-400 italic text-[11px]">
                            "{sub.feedback}"
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-rose-400 font-medium">Topshirilmagan</span>
                    )}

                    {sub ? (
                      <a
                        href={sub.content}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:underline flex items-center gap-1 font-mono-code text-[11px]"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Mening ishim</span>
                      </a>
                    ) : (
                      <button
                        onClick={() => {
                          setSubmittingHwId(hw.id);
                          setSubmissionUrl('');
                        }}
                        className="px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Hozir Topshirish</span>
                      </button>
                    )}
                  </div>

                  {submittingHwId === hw.id && (
                    <form
                      onSubmit={(e) => handleQuickSubmit(e, hw.id)}
                      className="pt-2 flex items-center gap-2"
                    >
                      <input
                        type="text"
                        placeholder="Natija yoki URL havolasi..."
                        value={submissionUrl}
                        onChange={(e) => setSubmissionUrl(e.target.value)}
                        className="flex-1 bg-slate-950 border border-cyan-500/40 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-400"
                        required
                      />
                      <button
                        type="submit"
                        className="px-3 py-1 bg-cyan-500 text-slate-950 font-bold rounded text-xs cursor-pointer"
                      >
                        Yuborish
                      </button>
                      <button
                        type="button"
                        onClick={() => setSubmittingHwId(null)}
                        className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs cursor-pointer"
                      >
                        Bekor
                      </button>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Certificate Callout Card */}
      <div className="cyber-glass rounded-xl p-6 border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-slate-900/50 to-cyan-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-code text-amber-400 mb-1">
            <Award className="w-4 h-4 text-amber-400" />
            <span>45-MAKTAB BITIRUV SERTIFIKATI</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            Sun'iy Intellekt Kursi Rasmiy Diplomi
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Sizning davomatingiz {attendancePercent}% va o'rtacha balingiz {avgScore} ball. Rasmiy verifikatsiyalangan sertifikatni ko'ring va PDF formatda yuklab oling.
          </p>
        </div>

        <button
          onClick={onOpenCertificateForMe}
          className="px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all cursor-pointer whitespace-nowrap"
        >
          <Award className="w-4 h-4" />
          <span>Sertifikatimni Ko'rish & Yuklash</span>
        </button>
      </div>
    </div>
  );
};
