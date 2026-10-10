import React, { useState } from 'react';
import { Student, AttendanceRecord, AttendanceStatus } from '../types';
import { CURRICULUM_72_LESSONS } from '../data/initialData';
import { Check, X, AlertCircle, Plus, Calendar, CheckCheck, Search, BookOpen } from 'lucide-react';

interface AttendanceTrackerProps {
  students: Student[];
  attendance: AttendanceRecord[];
  onUpdateAttendance: (newAttendance: AttendanceRecord[]) => void;
}

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({
  students,
  attendance,
  onUpdateAttendance,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    attendance[attendance.length - 1]?.date || new Date().toISOString().split('T')[0]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLessonNumber, setNewLessonNumber] = useState<number>(attendance.length + 1);
  const [newLessonTopic, setNewLessonTopic] = useState('');
  const [newLessonDate, setNewLessonDate] = useState(new Date().toISOString().split('T')[0]);

  // Find active record by selected date
  const currentRecordIndex = attendance.findIndex((a) => a.date === selectedDate);
  const currentRecord = currentRecordIndex !== -1 ? attendance[currentRecordIndex] : null;

  // Toggle status for single student in active record
  const handleSetStatus = (studentId: string, status: AttendanceStatus) => {
    if (currentRecordIndex === -1) return;

    const updated = [...attendance];
    const targetRecord = { ...updated[currentRecordIndex] };
    targetRecord.records = {
      ...targetRecord.records,
      [studentId]: status,
    };
    updated[currentRecordIndex] = targetRecord;
    onUpdateAttendance(updated);
  };

  // Mark all present in currently active lesson
  const handleMarkAllPresent = () => {
    if (currentRecordIndex === -1) return;
    const updated = [...attendance];
    const targetRecord = { ...updated[currentRecordIndex] };
    const newRecords: Record<string, AttendanceStatus> = {};
    students.forEach((s) => {
      newRecords[s.id] = 'present';
    });
    targetRecord.records = newRecords;
    updated[currentRecordIndex] = targetRecord;
    onUpdateAttendance(updated);
  };

  // Select lesson from 72 curriculum list
  const handleSelectCurriculumLesson = (lessonNum: number) => {
    const found = CURRICULUM_72_LESSONS.find((l) => l.number === lessonNum);
    if (found) {
      setNewLessonNumber(found.number);
      setNewLessonTopic(found.topic);
    }
  };

  // Add new lesson session
  const handleCreateNewLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTopic.trim()) return;

    // Check if date already exists
    const exists = attendance.some((a) => a.date === newLessonDate);
    if (exists) {
      setSelectedDate(newLessonDate);
      setShowAddModal(false);
      return;
    }

    const defaultRecords: Record<string, AttendanceStatus> = {};
    students.forEach((s) => {
      defaultRecords[s.id] = 'present';
    });

    const newRecord: AttendanceRecord = {
      date: newLessonDate,
      lessonNumber: newLessonNumber,
      lessonTopic: newLessonTopic.trim(),
      records: defaultRecords,
    };

    const updated = [...attendance, newRecord];
    onUpdateAttendance(updated);
    setSelectedDate(newLessonDate);
    setShowAddModal(false);
    setNewLessonTopic('');
    setNewLessonNumber(updated.length + 1);
  };

  // Calculate stats for student
  const getStudentStats = (studentId: string) => {
    let presentCount = 0;
    let absentCount = 0;
    let excusedCount = 0;
    let total = 0;

    attendance.forEach((rec) => {
      const status = rec.records[studentId];
      if (status) {
        total++;
        if (status === 'present') presentCount++;
        else if (status === 'absent') absentCount++;
        else if (status === 'excused') excusedCount++;
      }
    });

    const percent = total > 0 ? Math.round((presentCount / total) * 100) : 100;
    return { presentCount, absentCount, excusedCount, total, percent };
  };

  // Filter students
  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Attendance Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cyber-glass p-6 rounded-xl border border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>INTERAKTIV DAVOMAT HUD</span>
            <span aria-hidden="true">·</span>
            <span>72 TA DARS REJASIDAN {attendance.length} TASI O'TILDI</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Darslar Davomat Jurnali
          </h1>
          <p className="text-sm text-slate-300">
            Darslar bo'yicha ishtirokni (Keldi / Kelmadi / Sababli) belgilash va avtomatik foiz hisoblash.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              const nextNum = attendance.length + 1;
              const nextLesson = CURRICULUM_72_LESSONS.find((l) => l.number === nextNum);
              if (nextLesson) {
                setNewLessonNumber(nextLesson.number);
                setNewLessonTopic(nextLesson.topic);
              }
              setShowAddModal(true);
            }}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.35)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi Dars Davomati</span>
          </button>
        </div>
      </div>

      {/* Date Selector Strip & Current Lesson Bar */}
      <div className="cyber-glass-card rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <span className="text-xs font-mono-code text-slate-400 uppercase tracking-wider">
            O'tilgan Dars Sanasini Tanlang:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
            {attendance.map((att) => (
              <button
                key={att.date}
                onClick={() => setSelectedDate(att.date)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-code transition-all whitespace-nowrap cursor-pointer ${
                  selectedDate === att.date
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {att.lessonNumber}-dars ({att.date})
              </button>
            ))}
          </div>
        </div>

        {currentRecord ? (
          <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-cyan-400 font-mono-code mb-1">
                {currentRecord.lessonNumber}-DARS (72 SOATLIK REJADAN) · SANA: {currentRecord.date}
              </div>
              <div className="text-base font-bold text-white">
                {currentRecord.lessonTopic}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleMarkAllPresent}
                className="px-3 py-1.5 rounded bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Hammaga 'Keldi' Belgilash</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-slate-900 text-center text-sm text-slate-400">
            Tanlangan sana uchun davomat topilmadi.
          </div>
        )}
      </div>

      {/* Search & Student Attendance Table */}
      <div className="cyber-glass rounded-xl overflow-hidden border border-slate-800">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="O'quvchi ismi, logini yoki sinfi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700/60 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-4 text-xs font-mono-code text-slate-400 self-end sm:self-center">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
              <span>Keldi</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block" />
              <span>Kelmadi</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block" />
              <span>Sababli</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono-code border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">O'quvchi</th>
                <th className="py-3 px-3">Sinfi</th>
                <th className="py-3 px-4 text-center">Tanlangan Dars Holati</th>
                <th className="py-3 px-4 text-center">O'tilgan Darslar Tarixi</th>
                <th className="py-3 px-4 text-right">Umumiy Davomat %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStudents.map((student) => {
                const currentStatus: AttendanceStatus =
                  currentRecord?.records[student.id] || 'present';
                const stats = getStudentStats(student.id);

                return (
                  <tr key={student.id} className="hover:bg-slate-900/50 transition-colors">
                    {/* Student Info */}
                    <td className="py-3.5 px-4 font-medium text-white whitespace-nowrap">
                      <div className="font-semibold text-slate-100">{student.fullName}</div>
                      <div className="text-[11px] font-mono-code text-cyan-400/80">
                        {student.id} · <span className="text-slate-400">@{student.username}</span>
                      </div>
                    </td>

                    {/* Grade */}
                    <td className="py-3.5 px-3 text-slate-300 font-mono-code whitespace-nowrap">
                      {student.grade}
                    </td>

                    {/* Active lesson action buttons */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 p-1 rounded-lg bg-slate-950/80 border border-slate-800">
                        <button
                          onClick={() => handleSetStatus(student.id, 'present')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                            currentStatus === 'present'
                              ? 'bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                              : 'text-slate-400 hover:text-emerald-400'
                          }`}
                          title="Keldi"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Keldi</span>
                        </button>

                        <button
                          onClick={() => handleSetStatus(student.id, 'absent')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                            currentStatus === 'absent'
                              ? 'bg-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                              : 'text-slate-400 hover:text-rose-400'
                          }`}
                          title="Kelmadi"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Kelmadi</span>
                        </button>

                        <button
                          onClick={() => handleSetStatus(student.id, 'excused')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                            currentStatus === 'excused'
                              ? 'bg-amber-500 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                              : 'text-slate-400 hover:text-amber-400'
                          }`}
                          title="Sababli"
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Sababli</span>
                        </button>
                      </div>
                    </td>

                    {/* Attendance Mini Grid */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        {attendance.map((rec) => {
                          const st = rec.records[student.id] || 'present';
                          return (
                            <div
                              key={rec.date}
                              title={`${rec.lessonNumber}-dars (${rec.date}): ${st === 'present' ? 'Keldi' : st === 'absent' ? 'Kelmadi' : 'Sababli'}`}
                              className={`w-4 h-4 rounded text-[9px] flex items-center justify-center font-bold ${
                                st === 'present'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : st === 'absent'
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              }`}
                            >
                              {st === 'present' ? 'K' : st === 'absent' ? 'X' : 'S'}
                            </div>
                          );
                        })}
                      </div>
                    </td>

                    {/* Overall Attendance Percentage */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono-code">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              stats.percent >= 90
                                ? 'bg-emerald-400'
                                : stats.percent >= 75
                                ? 'bg-cyan-400'
                                : 'bg-rose-400'
                            }`}
                            style={{ width: `${stats.percent}%` }}
                          />
                        </div>
                        <span className={`font-bold ${
                          stats.percent >= 90
                            ? 'text-emerald-400'
                            : stats.percent >= 75
                            ? 'text-cyan-400'
                            : 'text-rose-400'
                        }`}>
                          {stats.percent}%
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {stats.presentCount} keldi / {stats.absentCount} kelmadi
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-sm font-semibold text-slate-300">
                        Davomat olish uchun avval o'quvchilar kiritilishi kerak
                      </p>
                      <p className="text-xs text-slate-500">
                        "O'quvchilar & Login" bo'limiga o'tib, yangi o'quvchilarni qo'shing.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Lesson Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="cyber-glass rounded-xl p-6 max-w-lg w-full border border-cyan-500/40 shadow-2xl my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <span>Yangi Dars Davomatini Ochish</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewLesson} className="space-y-4">
              {/* Select from 72 curriculum */}
              <div>
                <label className="block text-xs font-mono-code text-cyan-300 mb-1 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>72 Soatlik Rejadagi Darsni Tanlash (Avto-to'ldirish):</span>
                </label>
                <select
                  aria-label="Rejadagi darsni tanlash"
                  value={newLessonNumber}
                  onChange={(e) => handleSelectCurriculumLesson(parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  {CURRICULUM_72_LESSONS.map((l) => (
                    <option key={l.number} value={l.number}>
                      {l.number}-dars: {l.topic} ({l.week}-hafta {l.dayOfWeek})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">
                    Dars Raqami
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={72}
                    value={newLessonNumber}
                    onChange={(e) => {
                      const num = parseInt(e.target.value) || 1;
                      setNewLessonNumber(num);
                      const found = CURRICULUM_72_LESSONS.find((l) => l.number === num);
                      if (found) setNewLessonTopic(found.topic);
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">
                    Dars Sanasi
                  </label>
                  <input
                    type="date"
                    value={newLessonDate}
                    onChange={(e) => setNewLessonDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  Dars Mavzusi
                </label>
                <input
                  type="text"
                  value={newLessonTopic}
                  onChange={(e) => setNewLessonTopic(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                >
                  Bekor Qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.4)] cursor-pointer"
                >
                  Darsni Ro'yxatga Qo'shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
