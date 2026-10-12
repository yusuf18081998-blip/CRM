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
  completedLessons: number[];
  onToggleCompletedLesson: (lessonNumber: number) => void;
  onSetCompletedLessons: (lessons: number[]) => void;
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
  completedLessons,
  onToggleCompletedLesson,
  onSetCompletedLessons,
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

  // Calculate completed lessons stats
  const sortedCompleted = [...completedLessons].sort((a, b) => a - b);
  const maxCompleted = sortedCompleted.length > 0 ? Math.max(...sortedCompleted) : 0;
  const nextLessonNum = maxCompleted < 72 ? maxCompleted + 1 : null;
  const currentLessonObj = CURRICULUM_72_LESSONS.find((l) => l.number === maxCompleted);
  const nextLessonObj = CURRICULUM_72_LESSONS.find((l) => l.number === nextLessonNum);
  const progressPercent = Math.round((completedLessons.length / 72) * 100);

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
          {/* Interactive Lesson Progression Tracker Card */}
          <div className="cyber-glass-card rounded-xl p-5 border border-cyan-500/30 space-y-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>DARSLAR BOSQICHI & O'TILISH MONITORINGI</span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-lg font-bold text-white">
                    {currentLessonObj
                      ? `${currentLessonObj.week}-hafta ${currentLessonObj.dayOfWeek} (${currentLessonObj.number}-dars) o'tildi`
                      : "Hali dars o'tilmagan"}
                  </h2>
                  {nextLessonObj && (
                    <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono-code text-xs">
                      Keyingi: <strong>{nextLessonObj.week}-hafta {nextLessonObj.dayOfWeek} ({nextLessonObj.number}-dars)</strong>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Jami 72 darsdan <strong>{completedLessons.length} ta dars</strong> o'tildi ({progressPercent}% yakunlandi).
                  {role === 'admin' && " Istalgan dars qatoridagi 'Holat' tugmasini bosib, darsni o'tildi yoki rejadagi deb erkin belgilashingiz mumkin."}
                </p>
              </div>

              {/* Admin Quick Progression Presets */}
              {role === 'admin' && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      // Biz hozir 5 hafta dushanbani o'tganmiz (1-9 darslar)
                      onSetCompletedLessons([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-xs font-mono-code flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                    title="Hozirgi bosqich: 5-hafta Dushanba (9-dars)gacha belgilash"
                  >
                    <span>⭐ 5-hafta Dushanbagacha belgilash (9-dars)</span>
                  </button>

                  {nextLessonNum && (
                    <button
                      type="button"
                      onClick={() => onToggleCompletedLesson(nextLessonNum)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 text-xs font-mono-code flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Keyingi darsni o'tildi deb belgilash"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Keyingi dars ({nextLessonNum}-dars)</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (completedLessons.length === 0) return;
                      const last = Math.max(...completedLessons);
                      onToggleCompletedLesson(last);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono-code transition-all cursor-pointer"
                    title="Oxirgi o'tilgan darsni bekor qilish"
                  >
                    <span>-1 dars</span>
                  </button>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono-code text-slate-400">
                <span className={completedLessons.length >= 1 ? 'text-cyan-400 font-bold' : ''}>1-chorak (1-18)</span>
                <span className={completedLessons.length >= 19 ? 'text-cyan-400 font-bold' : ''}>2-chorak (19-34)</span>
                <span className={completedLessons.length >= 35 ? 'text-cyan-400 font-bold' : ''}>3-chorak (35-54)</span>
                <span className={completedLessons.length >= 55 ? 'text-cyan-400 font-bold' : ''}>4-chorak (55-72)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

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
                        {completedLessons.includes(item.number) ? (
                          <button
                            type="button"
                            disabled={role !== 'admin'}
                            onClick={() => role === 'admin' && onToggleCompletedLesson(item.number)}
                            className={`text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30 text-[11px] inline-flex items-center gap-1 font-semibold ${
                              role === 'admin'
                                ? 'hover:bg-emerald-500/20 hover:border-emerald-500/60 cursor-pointer transition-all'
                                : ''
                            }`}
                            title={role === 'admin' ? "Bosib, o'tilmagan deb o'zgartirish" : undefined}
                          >
                            <CheckCircle className="w-3 h-3 text-emerald-400" />
                            <span>O'tildi</span>
                          </button>
                        ) : item.number === nextLessonNum ? (
                          <button
                            type="button"
                            disabled={role !== 'admin'}
                            onClick={() => role === 'admin' && onToggleCompletedLesson(item.number)}
                            className={`text-cyan-300 bg-cyan-500/20 px-2.5 py-1 rounded border border-cyan-500/40 text-[11px] font-bold animate-pulse inline-flex items-center gap-1 ${
                              role === 'admin'
                                ? 'hover:bg-cyan-500/30 hover:border-cyan-400 cursor-pointer transition-all'
                                : ''
                            }`}
                            title={role === 'admin' ? "Dars o'tildi deb belgilash uchun bosing" : undefined}
                          >
                            <Sparkles className="w-3 h-3 text-cyan-400" />
                            <span>Keyingi dars</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={role !== 'admin'}
                            onClick={() => role === 'admin' && onToggleCompletedLesson(item.number)}
                            className={`text-slate-500 text-[11px] px-2 py-0.5 rounded border border-transparent ${
                              role === 'admin'
                                ? 'hover:text-cyan-400 hover:border-slate-700 hover:bg-slate-900 cursor-pointer transition-all'
                                : ''
                            }`}
                            title={role === 'admin' ? "O'tildi deb belgilash uchun bosing" : undefined}
                          >
                            <span>Rejada</span>
                          </button>
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

          {homework.length === 0 ? (
            <div className="cyber-glass-card rounded-xl p-8 text-center border border-dashed border-slate-800">
              <BookOpen className="w-8 h-8 text-cyan-400/40 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300 mb-1">Hozircha uy vazifalari mavjud emas</p>
              <p className="text-xs text-slate-500 mb-4">Ustoz dars davomida yangi amaliy topshiriq qo'shishi mumkin.</p>
              {role === 'admin' && (
                <button
                  onClick={() => setShowAddHwModal(true)}
                  className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 cursor-pointer"
                >
                  + Yangi Vazifa Qo'shish
                </button>
              )}
            </div>
          ) : (
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
        )}
      </div>
    )}

      {/* Subtab 3: Submissions & 100-Ball Baholash Tizimi */}
      {activeSubTab === 'submissions' && (
        <div className="space-y-4">
          {/* 100 Ballik Baholash Tizimi Qo'llanmasi & Ko'rsatmasi */}
          <div className="cyber-glass-card rounded-xl p-4 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-amber-950/20 to-slate-900/60">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono-code text-amber-400">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="font-bold">100 BALLIK BAHOLASH TIZIMI (USTOZ UCHUN YO'RIQNOMA)</span>
              </div>
              <p className="text-xs text-slate-300">
                O'quvchilar topshirgan amaliy ishlar jadvaldagi <strong>"Baholash"</strong> tugmasi orqali tekshiriladi va 100 ballgacha baholanadi.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap font-mono-code text-[11px]">
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                🟢 86 – 100: A'lo
              </span>
              <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                🔵 71 – 85: Yaxshi
              </span>
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                🟡 56 – 70: Qoniqarli
              </span>
              <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                🔴 0 – 55: Qayta topshirish
              </span>
            </div>
          </div>

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

                {submissions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      Hozircha topshirilgan vazifalar yo'q.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono-code text-slate-300">
                    Baho (100 ballik tizimda)
                  </label>
                  <span className="text-[11px] font-mono-code text-cyan-400">
                    {gradeScore >= 86 ? "🟢 A'lo (86-100)" : gradeScore >= 71 ? "🔵 Yaxshi (71-85)" : gradeScore >= 56 ? "🟡 Qoniqarli (56-70)" : "🔴 Qoniqarsiz (0-55)"}
                  </span>
                </div>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={gradeScore}
                  onChange={(e) => setGradeScore(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-lg font-bold font-mono-code text-amber-300 focus:outline-none focus:border-cyan-400"
                  required
                />
                {/* 100 ballik tizim tezkor tugmalari */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span className="text-[10px] text-slate-400 font-mono-code mr-1">Tezkor ball:</span>
                  {[100, 95, 90, 85, 80, 75, 60].map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setGradeScore(score)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono-code font-bold transition-all cursor-pointer ${
                        gradeScore === score
                          ? 'bg-amber-400 text-slate-950 shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
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
