import React, { useState } from 'react';
import { Homework, StudentSubmission, Student, UserRole } from '../types';
import { CURRICULUM_72_LESSONS } from '../data/initialData';
import { Calendar, BookOpen, Clock, MapPin, User, CheckCircle, ExternalLink, Plus, Send, X, Award, Search, Sparkles, Filter } from 'lucide-react';

interface ScheduleAndHomeworkProps {
  homework: Homework[];
  submissions: StudentSubmission[];
  students: Student[];
  role: UserRole;
  activeStudent: Student | null;
  onAddHomework: (hw: Homework) => void;
  onSubmitHomework: (sub: StudentSubmission) => void;
  onGradeSubmission: (subId: string, score: number, feedback: string) => void;
}

export const ScheduleAndHomework: React.FC<ScheduleAndHomeworkProps> = ({
  homework,
  submissions,
  students,
  role,
  activeStudent,
  onAddHomework,
  onSubmitHomework,
  onGradeSubmission,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'curriculum' | 'homework' | 'submissions'>('curriculum');
  const [quarterFilter, setQuarterFilter] = useState<number | 'all'>('all');
  const [curriculumSearch, setCurriculumSearch] = useState('');

  // Homework creation modal
  const [showAddHwModal, setShowAddHwModal] = useState(false);
  const [hwTitle, setHwTitle] = useState('');
  const [hwModule, setHwModule] = useState('1-Chorak: Prompt Asoslari');
  const [hwDesc, setHwDesc] = useState('');
  const [hwDueDate, setHwDueDate] = useState('2026-09-30');
  const [hwDiff, setHwDiff] = useState<'Oson' | "O'rta" | 'Murakkab'>("O'rta");
  const [hwLink, setHwLink] = useState('');

  // Submit modal
  const [submittingHw, setSubmittingHw] = useState<Homework | null>(null);
  const [submitContent, setSubmitContent] = useState('');

  // Grading modal
  const [gradingSub, setGradingSub] = useState<StudentSubmission | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(95);
  const [gradeFeedback, setGradeFeedback] = useState('Topshiriq talablari to\'liq bajarilgan.');

  const handleCreateHw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwTitle.trim()) return;

    const newHw: Homework = {
      id: `HW-${String(homework.length + 1).padStart(2, '0')}`,
      lessonNumber: homework.length + 1,
      moduleName: hwModule,
      title: hwTitle.trim(),
      description: hwDesc.trim(),
      dueDate: hwDueDate,
      maxScore: 100,
      difficulty: hwDiff,
      starterCodeOrLink: hwLink.trim() || undefined,
    };

    onAddHomework(newHw);
    setShowAddHwModal(false);
    setHwTitle('');
    setHwDesc('');
  };

  const handleSubmitHw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingHw || !activeStudent || !submitContent.trim()) return;

    const newSub: StudentSubmission = {
      id: `SUB-${Date.now().toString().slice(-4)}`,
      homeworkId: submittingHw.id,
      studentId: activeStudent.id,
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      content: submitContent.trim(),
      status: 'pending',
    };

    onSubmitHomework(newSub);
    setSubmittingHw(null);
    setSubmitContent('');
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSub) return;

    onGradeSubmission(gradingSub.id, gradeScore, gradeFeedback);
    setGradingSub(null);
  };

  // Filter 72 lessons
  const filteredLessons = CURRICULUM_72_LESSONS.filter((item) => {
    const matchesQuarter = quarterFilter === 'all' || item.quarter === quarterFilter;
    const matchesSearch =
      item.topic.toLowerCase().includes(curriculumSearch.toLowerCase()) ||
      String(item.number).includes(curriculumSearch) ||
      `${item.week}-hafta`.includes(curriculumSearch.toLowerCase());

    return matchesQuarter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cyber-glass p-6 rounded-xl border border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>72 SOATLIK YILLIK DARS ISH REJASI (10–15 YOSH, 36 HAFTA)</span>
            <span aria-hidden="true">·</span>
            <span>STEM LAB</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Sun'iy Intellekt Kursi Sillabusi & Vazifalar
          </h1>
          <p className="text-sm text-slate-300">
            Ustoz M.Xo'jayev tomonidan Dushanba va Chorshanba kunlari o'tiladigan 72 soatlik to'liq dastur, nazorat ishlari va amaliy topshiriqlar.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1 bg-slate-900/90 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveSubTab('curriculum')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
              activeSubTab === 'curriculum'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            72 Soatlik Ish Reja
          </button>
          <button
            onClick={() => setActiveSubTab('homework')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
              activeSubTab === 'homework'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Vazifalar ({homework.length})
          </button>
          <button
            onClick={() => setActiveSubTab('submissions')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
              activeSubTab === 'submissions'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Topshirilgan Ishlar ({submissions.length})
          </button>
        </div>
      </div>

      {/* Subtab 1: 72 Lessons Curriculum Plan */}
      {activeSubTab === 'curriculum' && (
        <div className="space-y-5">
          {/* Quarter Filters & Search Bar */}
          <div className="cyber-glass-card rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Dars mavzusi, raqami yoki hafta bo'yicha qidiruv..."
                value={curriculumSearch}
                onChange={(e) => setCurriculumSearch(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700/60 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { label: 'Barchasi (72)', value: 'all' },
                { label: '1-Chorak (1-18)', value: 1 },
                { label: '2-Chorak (19-34)', value: 2 },
                { label: '3-Chorak (35-54)', value: 3 },
                { label: '4-Chorak (55-72)', value: 4 },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => setQuarterFilter(btn.value as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    quarterFilter === btn.value
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* 72 Lessons Table */}
          <div className="cyber-glass rounded-xl overflow-hidden border border-slate-800">
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/95 sticky top-0 z-10 text-slate-400 uppercase font-mono-code border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-3 text-center w-12">#</th>
                    <th className="py-3 px-4 w-44">Kun / Hafta</th>
                    <th className="py-3 px-4">Dars Mavzusi</th>
                    <th className="py-3 px-3 text-center w-28">Chorak</th>
                    <th className="py-3 px-4 text-right w-36">Holat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredLessons.map((item) => (
                    <tr
                      key={item.number}
                      className={`hover:bg-slate-900/60 transition-colors ${
                        item.isExam ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      {/* # Number */}
                      <td className="py-3 px-3 text-center font-mono-code font-bold text-cyan-400">
                        {item.number}
                      </td>

                      {/* Day and Week */}
                      <td className="py-3 px-4 font-mono-code whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-300 font-semibold">{item.week}-hafta</span>
                          <span className="text-slate-500">/</span>
                          <span className={`text-[11px] px-1.5 py-0.5 rounded ${
                            item.dayOfWeek === 'Dushanba'
                              ? 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                              : 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                          }`}>
                            {item.dayOfWeek}
                          </span>
                        </div>
                      </td>

                      {/* Topic */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {item.isExam && (
                            <Award className="w-4 h-4 text-amber-400 shrink-0" />
                          )}
                          <span className={`font-medium ${
                            item.isExam
                              ? 'text-amber-300 font-bold uppercase tracking-wide'
                              : 'text-slate-100'
                          }`}>
                            {item.topic}
                          </span>
                        </div>
                      </td>

                      {/* Quarter */}
                      <td className="py-3 px-3 text-center font-mono-code whitespace-nowrap">
                        <span className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {item.quarter}-chorak
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-right whitespace-nowrap font-mono-code">
                        {item.number <= 6 ? (
                          <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 text-[11px]">
                            O'tildi
                          </span>
                        ) : item.number === 7 ? (
                          <span className="text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/40 text-[11px] font-bold animate-pulse">
                            Keyingi dars
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">
                            Rejada
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Homework List */}
      {activeSubTab === 'homework' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-code text-slate-400">
              JAMI {homework.length} TA AMALIY TOPSHIRIQ
            </span>
            {role === 'admin' && (
              <button
                onClick={() => setShowAddHwModal(true)}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Yangi Vazifa Qo'shish</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {homework.map((hw) => {
              const studentSub = activeStudent
                ? submissions.find((s) => s.homeworkId === hw.id && s.studentId === activeStudent.id)
                : null;

              return (
                <div
                  key={hw.id}
                  className="cyber-glass-card rounded-xl p-5 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono-code text-cyan-400">
                        {hw.id} · {hw.moduleName}
                      </span>
                      <span className={`text-[10px] font-mono-code font-bold px-2 py-0.5 rounded ${
                        hw.difficulty === 'Oson'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : hw.difficulty === "O'rta"
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {hw.difficulty}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2">
                      {hw.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {hw.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-1 font-mono-code">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Muddati: <strong className="text-slate-200">{hw.dueDate}</strong></span>
                      </div>
                      <span className="font-mono-code text-amber-300 font-bold">
                        {hw.maxScore} ball
                      </span>
                    </div>

                    {hw.starterCodeOrLink && (
                      <a
                        href={hw.starterCodeOrLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono-code"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Platforma havolasi</span>
                      </a>
                    )}

                    {/* Student Action: Submit */}
                    {role === 'student' && (
                      <div className="pt-2">
                        {studentSub ? (
                          <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs">
                            <span className="text-emerald-400 flex items-center gap-1 font-medium">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Topshirilgan: {studentSub.status === 'graded' ? `${studentSub.score} ball` : 'Kutilmoqda'}</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono-code">{studentSub.submittedAt}</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSubmittingHw(hw);
                              setSubmitContent('');
                            }}
                            className="w-full py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Vazifani Topshirish</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtab 3: Submissions */}
      {activeSubTab === 'submissions' && (
        <div className="cyber-glass rounded-xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono-code border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">O'quvchi</th>
                  <th className="py-3 px-3">Topshiriq</th>
                  <th className="py-3 px-3">Topshirilgan Vaqt</th>
                  <th className="py-3 px-3">Havola / Ish</th>
                  <th className="py-3 px-3 text-center">Holat</th>
                  <th className="py-3 px-3 text-center">Baho</th>
                  <th className="py-3 px-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {submissions.map((sub) => {
                  const student = students.find((s) => s.id === sub.studentId);
                  const hw = homework.find((h) => h.id === sub.homeworkId);

                  return (
                    <tr key={sub.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-white whitespace-nowrap">
                        <div className="font-semibold text-slate-100">{student?.fullName || sub.studentId}</div>
                        <div className="text-[11px] font-mono-code text-cyan-400/80">{student?.grade || ''}</div>
                      </td>

                      <td className="py-3.5 px-3 text-slate-200 whitespace-nowrap">
                        <div className="font-medium">{hw?.title || sub.homeworkId}</div>
                        <div className="text-[11px] text-slate-400 font-mono-code">{hw?.moduleName}</div>
                      </td>

                      <td className="py-3.5 px-3 text-slate-300 font-mono-code whitespace-nowrap">
                        {sub.submittedAt}
                      </td>

                      <td className="py-3.5 px-3 whitespace-nowrap font-mono-code">
                        <a
                          href={sub.content}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span className="truncate max-w-[150px]">{sub.content}</span>
                        </a>
                      </td>

                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <span className={`text-[10px] font-mono-code font-bold px-2 py-0.5 rounded ${
                          sub.status === 'graded'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {sub.status === 'graded' ? 'Tekshirildi' : 'Kutilmoqda'}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-center whitespace-nowrap font-mono-code">
                        {sub.score !== undefined ? (
                          <span className="font-bold text-amber-300">{sub.score} / 100</span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {role === 'admin' ? (
                          <button
                            onClick={() => {
                              setGradingSub(sub);
                              setGradeScore(sub.score || 95);
                              setGradeFeedback(sub.feedback || 'Yaxshi bajarilgan.');
                            }}
                            className="px-2.5 py-1 rounded bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Baholash
                          </button>
                        ) : (
                          <span className="text-slate-500 text-xs">
                            {sub.feedback ? 'Izoh berildi' : 'Jarayonda'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Homework Modal */}
      {showAddHwModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="cyber-glass rounded-xl p-6 max-w-md w-full border border-cyan-500/40 shadow-2xl my-auto">
            <h3 className="text-lg font-bold text-white mb-4 pb-3 border-b border-slate-800 flex items-center gap-2">
              <Plus className="w-5 h-5 text-cyan-400" />
              <span>Yangi AI Laboratoriya Topshirig'i</span>
            </h3>

            <form onSubmit={handleCreateHw} className="space-y-4">
              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  Vazifa Nomi
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Claude bilan tahlil prompti"
                  value={hwTitle}
                  onChange={(e) => setHwTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">
                    Kurs Choragi
                  </label>
                  <select
                    value={hwModule}
                    onChange={(e) => setHwModule(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="1-Chorak: Prompt Asoslari">1-Chorak (Prompt Asoslari)</option>
                    <option value="2-Chorak: Generativ Dizayn">2-Chorak (Generativ Dizayn)</option>
                    <option value="3-Chorak: Audio va Video AI">3-Chorak (Audio va Video AI)</option>
                    <option value="4-Chorak: Telegram Bot va Loyiha">4-Chorak (Bot & Yillik Loyiha)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">
                    Qiyinligi
                  </label>
                  <select
                    value={hwDiff}
                    onChange={(e) => setHwDiff(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Oson">Oson</option>
                    <option value="O'rta">O'rta</option>
                    <option value="Murakkab">Murakkab</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  Muddati (Deadline)
                </label>
                <input
                  type="date"
                  value={hwDueDate}
                  onChange={(e) => setHwDueDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  Vazifa Tavsifi
                </label>
                <textarea
                  placeholder="Talabalar qanday natijaga erishishi kerak..."
                  value={hwDesc}
                  onChange={(e) => setHwDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  Platforma Havolasi (ixtiyoriy)
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={hwLink}
                  onChange={(e) => setHwLink(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddHwModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                >
                  Bekor Qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.4)] cursor-pointer"
                >
                  Vazifani E'lon Qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Submit Modal */}
      {submittingHw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="cyber-glass rounded-xl p-6 max-w-md w-full border border-cyan-500/40 shadow-2xl my-auto">
            <h3 className="text-lg font-bold text-white mb-2 pb-2 border-b border-slate-800">
              Vazifani Topshirish: {submittingHw.title}
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              Loyiha havolasi yoki natija matnini kiriting.
            </p>

            <form onSubmit={handleSubmitHw} className="space-y-4">
              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  Natija / URL Havola
                </label>
                <input
                  type="text"
                  placeholder="https://chatgpt.com/share/... yoki havola"
                  value={submitContent}
                  onChange={(e) => setSubmitContent(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSubmittingHw(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                >
                  Bekor Qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.4)] cursor-pointer"
                >
                  Topshirish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Grade Modal */}
      {gradingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="cyber-glass rounded-xl p-6 max-w-md w-full border border-cyan-500/40 shadow-2xl my-auto">
            <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-slate-800 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Topshiriqni Baholash</span>
            </h3>

            <form onSubmit={handleSaveGrade} className="space-y-4">
              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  Baho (Maksimal 100 ball)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={gradeScore}
                  onChange={(e) => setGradeScore(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  Ustoz Izohi va Maslahatlari
                </label>
                <textarea
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setGradingSub(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                >
                  Bekor Qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.4)] cursor-pointer"
                >
                  Bahoni Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
