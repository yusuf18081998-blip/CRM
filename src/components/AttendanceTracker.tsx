import React, { useState } from 'react';
import { Student, AttendanceRecord, AttendanceStatus } from '../types';
import { CURRICULUM_72_LESSONS } from '../data/initialData';
import {
  Check,
  X,
  AlertCircle,
  Plus,
  Calendar,
  CheckCheck,
  Search,
  BookOpen,
  Printer,
  ChevronLeft,
  ChevronRight,
  FileText,
  Table,
  LayoutGrid,
  Trash2,
  Sparkles,
  ArrowRight,
  Edit3,
  Star,
  Award,
  MessageSquare,
  RotateCcw,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

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
  // Navigation / View modes
  const [activeView, setActiveView] = useState<'sheet' | 'grading' | 'catalog' | 'matrix'>('sheet');

  // Currently selected lesson number (Default to latest opened lesson or lesson 1)
  const initialLessonNum = attendance.length > 0
    ? attendance[attendance.length - 1].lessonNumber
    : 1;
  const [selectedLessonNum, setSelectedLessonNum] = useState<number>(initialLessonNum);

  // Filters & Search
  const [catalogQuarter, setCatalogQuarter] = useState<number | 'all'>('all');
  const [topicSearch, setTopicSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');

  // Matrix view toggle: 'attendance' or 'grades'
  const [matrixMode, setMatrixMode] = useState<'attendance' | 'grades'>('attendance');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [editingNoteStudentId, setEditingNoteStudentId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');

  // Comment input per student for grading
  const [editingCommentStudentId, setEditingCommentStudentId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  // Form for custom or new lesson modal
  const [formLessonNum, setFormLessonNum] = useState<number>(attendance.length + 1);
  const [formLessonTopic, setFormLessonTopic] = useState('');
  const [formLessonDate, setFormLessonDate] = useState(new Date().toISOString().split('T')[0]);

  // Find attendance record for selected lesson number
  const activeRecord = attendance.find((a) => a.lessonNumber === selectedLessonNum);
  const curriculumLesson = CURRICULUM_72_LESSONS.find((l) => l.number === selectedLessonNum);

  // Open / create an attendance sheet for a specific lesson
  const handleOpenSheetForLesson = (lessonNum: number, viewTarget: 'sheet' | 'grading' = 'sheet') => {
    const existing = attendance.find((a) => a.lessonNumber === lessonNum);
    if (!existing) {
      const curLesson = CURRICULUM_72_LESSONS.find((l) => l.number === lessonNum);
      const defaultRecords: Record<string, AttendanceStatus> = {};
      const defaultGrades: Record<string, number> = {};
      students.forEach((s) => {
        defaultRecords[s.id] = 'present';
        defaultGrades[s.id] = 5; // Default 5 baho
      });

      const newRec: AttendanceRecord = {
        lessonNumber: lessonNum,
        lessonTopic: curLesson?.topic || `${lessonNum}-dars mavzusi`,
        date: new Date().toISOString().split('T')[0],
        quarter: curLesson?.quarter || 1,
        records: defaultRecords,
        grades: defaultGrades,
        gradeComments: {},
      };

      const updated = [...attendance, newRec].sort((a, b) => a.lessonNumber - b.lessonNumber);
      onUpdateAttendance(updated);
    }
    setSelectedLessonNum(lessonNum);
    setActiveView(viewTarget);
  };

  // Set student attendance status
  const handleSetStudentStatus = (studentId: string, status: AttendanceStatus) => {
    if (!activeRecord) return;

    const updated = attendance.map((rec) => {
      if (rec.lessonNumber === selectedLessonNum) {
        return {
          ...rec,
          records: {
            ...rec.records,
            [studentId]: status,
          },
        };
      }
      return rec;
    });

    onUpdateAttendance(updated);
  };

  // Set student daily grade (5, 4, 3, 2 or custom points)
  const handleSetStudentGrade = (studentId: string, grade: number) => {
    if (!activeRecord) return;

    const updated = attendance.map((rec) => {
      if (rec.lessonNumber === selectedLessonNum) {
        const currentGrades = { ...(rec.grades || {}) };
        // If clicked on the same grade again, toggle it off (or keep)
        if (currentGrades[studentId] === grade) {
          delete currentGrades[studentId];
        } else {
          currentGrades[studentId] = grade;
        }
        return {
          ...rec,
          grades: currentGrades,
        };
      }
      return rec;
    });

    onUpdateAttendance(updated);
  };

  // Set student daily grade comment
  const handleSaveGradeComment = (studentId: string, comment: string) => {
    if (!activeRecord) return;

    const updated = attendance.map((rec) => {
      if (rec.lessonNumber === selectedLessonNum) {
        const currentComments = { ...(rec.gradeComments || {}) };
        if (comment.trim()) {
          currentComments[studentId] = comment.trim();
        } else {
          delete currentComments[studentId];
        }
        return {
          ...rec,
          gradeComments: currentComments,
        };
      }
      return rec;
    });

    onUpdateAttendance(updated);
    setEditingCommentStudentId(null);
    setCommentInput('');
  };

  // Mark all students present in the active sheet
  const handleMarkAllPresentInSheet = () => {
    if (!activeRecord) return;

    const updated = attendance.map((rec) => {
      if (rec.lessonNumber === selectedLessonNum) {
        const newRecords: Record<string, AttendanceStatus> = {};
        students.forEach((s) => {
          newRecords[s.id] = 'present';
        });
        return {
          ...rec,
          records: newRecords,
        };
      }
      return rec;
    });

    onUpdateAttendance(updated);
  };

  // Set bulk grade for all students for this lesson
  const handleSetBulkGrade = (grade: number) => {
    if (!activeRecord) return;

    const updated = attendance.map((rec) => {
      if (rec.lessonNumber === selectedLessonNum) {
        const newGrades: Record<string, number> = {};
        students.forEach((s) => {
          newGrades[s.id] = grade;
        });
        return {
          ...rec,
          grades: newGrades,
        };
      }
      return rec;
    });

    onUpdateAttendance(updated);
  };

  // Clear all grades for this lesson
  const handleClearAllGrades = () => {
    if (!activeRecord) return;
    if (window.confirm("Ushbu darsdagi barcha o'quvchilar baholarini tozalamoqchimisiz?")) {
      const updated = attendance.map((rec) => {
        if (rec.lessonNumber === selectedLessonNum) {
          return {
            ...rec,
            grades: {},
            gradeComments: {},
          };
        }
        return rec;
      });
      onUpdateAttendance(updated);
    }
  };

  // Update date of the active sheet
  const handleUpdateSheetDate = (newDate: string) => {
    if (!activeRecord) return;
    const updated = attendance.map((rec) => {
      if (rec.lessonNumber === selectedLessonNum) {
        return { ...rec, date: newDate };
      }
      return rec;
    });
    onUpdateAttendance(updated);
  };

  // Save reason note for attendance
  const handleSaveStudentNote = (studentId: string) => {
    if (!activeRecord) return;
    const updated = attendance.map((rec) => {
      if (rec.lessonNumber === selectedLessonNum) {
        const newNotes = { ...(rec.notes || {}) };
        if (noteInput.trim()) {
          newNotes[studentId] = noteInput.trim();
        } else {
          delete newNotes[studentId];
        }
        return { ...rec, notes: newNotes };
      }
      return rec;
    });
    onUpdateAttendance(updated);
    setEditingNoteStudentId(null);
    setNoteInput('');
  };

  // Delete active lesson sheet
  const handleDeleteActiveSheet = () => {
    if (!activeRecord) return;
    if (window.confirm(`Haqiqatan ham ${activeRecord.lessonNumber}-dars davomat va baholash betini o'chirmoqchimisiz?`)) {
      const updated = attendance.filter((a) => a.lessonNumber !== selectedLessonNum);
      onUpdateAttendance(updated);
      if (updated.length > 0) {
        setSelectedLessonNum(updated[updated.length - 1].lessonNumber);
      }
    }
  };

  // Handle modal submit for custom new lesson
  const handleCreateCustomLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLessonTopic.trim()) return;

    const defaultRecords: Record<string, AttendanceStatus> = {};
    const defaultGrades: Record<string, number> = {};
    students.forEach((s) => {
      defaultRecords[s.id] = 'present';
      defaultGrades[s.id] = 5;
    });

    const curLesson = CURRICULUM_72_LESSONS.find((l) => l.number === formLessonNum);

    const newRecord: AttendanceRecord = {
      lessonNumber: formLessonNum,
      lessonTopic: formLessonTopic.trim(),
      date: formLessonDate,
      quarter: curLesson?.quarter || 1,
      records: defaultRecords,
      grades: defaultGrades,
    };

    const exists = attendance.some((a) => a.lessonNumber === formLessonNum);
    let updated: AttendanceRecord[];
    if (exists) {
      updated = attendance.map((a) => (a.lessonNumber === formLessonNum ? newRecord : a));
    } else {
      updated = [...attendance, newRecord].sort((a, b) => a.lessonNumber - b.lessonNumber);
    }

    onUpdateAttendance(updated);
    setSelectedLessonNum(formLessonNum);
    setShowAddModal(false);
    setActiveView('sheet');
  };

  // Calculate attendance stats for current active sheet
  let activePresent = 0;
  let activeAbsent = 0;
  let activeExcused = 0;
  if (activeRecord) {
    students.forEach((s) => {
      const st = activeRecord.records[s.id] || 'present';
      if (st === 'present') activePresent++;
      else if (st === 'absent') activeAbsent++;
      else if (st === 'excused') activeExcused++;
    });
  }
  const activeTotal = students.length;
  const activeRate = activeTotal > 0 ? Math.round((activePresent / activeTotal) * 100) : 100;

  // Calculate grading stats for current active sheet
  let activeGradedCount = 0;
  let activeGradeSum = 0;
  let count5 = 0;
  let count4 = 0;
  let count3 = 0;
  let count2 = 0;

  if (activeRecord?.grades) {
    Object.values(activeRecord.grades).forEach((g) => {
      if (typeof g === 'number' && g > 0) {
        activeGradedCount++;
        activeGradeSum += g;
        if (g === 5 || g >= 86) count5++;
        else if (g === 4 || g >= 71) count4++;
        else if (g === 3 || g >= 56) count3++;
        else count2++;
      }
    });
  }
  const activeAvgGrade = activeGradedCount > 0
    ? (activeGradeSum / activeGradedCount).toFixed(1)
    : '0.0';

  // Filter students for the active sheet table
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.username.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.id.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesGrade = gradeFilter === 'all' || s.grade.includes(gradeFilter);
    return matchesSearch && matchesGrade;
  });

  // Calculate cumulative student attendance stats
  const getStudentCumulativeStats = (studentId: string) => {
    let p = 0;
    let total = 0;
    attendance.forEach((rec) => {
      total++;
      if (rec.records[studentId] === 'present') p++;
    });
    const percent = total > 0 ? Math.round((p / total) * 100) : 100;
    return { present: p, total, percent };
  };

  // Calculate cumulative student daily grades average
  const getStudentAverageGrade = (studentId: string) => {
    let sum = 0;
    let count = 0;
    attendance.forEach((rec) => {
      const g = rec.grades?.[studentId];
      if (typeof g === 'number' && g > 0) {
        sum += g;
        count++;
      }
    });
    return count > 0 ? (sum / count).toFixed(1) : '-';
  };

  // Filtered curriculum lessons for Catalog view
  const filteredCurriculum = CURRICULUM_72_LESSONS.filter((item) => {
    const matchesQuarter = catalogQuarter === 'all' || item.quarter === catalogQuarter;
    const matchesSearch =
      item.topic.toLowerCase().includes(topicSearch.toLowerCase()) ||
      item.number.toString().includes(topicSearch) ||
      item.dayOfWeek.toLowerCase().includes(topicSearch.toLowerCase());
    return matchesQuarter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cyber-glass p-6 rounded-xl border border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>KUNLIK DAVOMAT VA KUNLIK BAHOLASH TIZIMI</span>
            <span aria-hidden="true">·</span>
            <span>72 TA MAVZUDAN {attendance.length} TASI OCHILGAN</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Darslar Davomati & Kunlik Baholash</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-normal">
              Har bir kunga alohida baho
            </span>
          </h1>
          <p className="text-sm text-slate-300 mt-0.5">
            Har bir dars kuni uchun alohida ishtirokni belgilash, o'quvchilarga <strong>kunlik dars baholari</strong> (5, 4, 3, 2 yoki ball) qo'yish va izoh yozish.
          </p>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center p-1 rounded-lg bg-slate-900 border border-slate-800">
            {/* Davomat Beti */}
            <button
              onClick={() => setActiveView('sheet')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'sheet'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Davomat Beti</span>
            </button>

            {/* Kunlik Baholash Bo'limi (User explicit request) */}
            <button
              onClick={() => setActiveView('grading')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'grading'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(251,191,36,0.5)]'
                  : 'text-amber-400/90 hover:text-amber-300'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Kunlik Baholash ⭐</span>
            </button>

            {/* Mavzular Katalogi */}
            <button
              onClick={() => setActiveView('catalog')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'catalog'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Mavzular (72)</span>
            </button>

            {/* Yig'ma Jurnal */}
            <button
              onClick={() => setActiveView('matrix')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'matrix'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Yig'ma Jurnal</span>
            </button>
          </div>

          <button
            onClick={() => {
              setFormLessonNum(attendance.length + 1);
              const cur = CURRICULUM_72_LESSONS.find((l) => l.number === attendance.length + 1);
              setFormLessonTopic(cur ? cur.topic : '');
              setShowAddModal(true);
            }}
            className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(6,182,212,0.35)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi Bet Ochish</span>
          </button>
        </div>
      </div>

      {/* TOPIC SELECTOR RIBBON (Active in sheet & grading views) */}
      {(activeView === 'sheet' || activeView === 'grading') && (
        <div className="cyber-glass-card rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border border-slate-800">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs font-mono-code text-slate-400 shrink-0 uppercase tracking-wider">
              Dars Kunini Tanlang:
            </span>
            <select
              aria-label="Dars mavzusini tanlash"
              value={selectedLessonNum}
              onChange={(e) => setSelectedLessonNum(parseInt(e.target.value))}
              className="bg-slate-900 border border-cyan-500/40 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono-code max-w-xs sm:max-w-md truncate"
            >
              {CURRICULUM_72_LESSONS.map((l) => {
                const rec = attendance.find((a) => a.lessonNumber === l.number);
                const hasGrades = rec?.grades && Object.keys(rec.grades).length > 0;
                return (
                  <option key={l.number} value={l.number}>
                    {rec ? '✓ ' : '○ '} {l.number}-dars: {l.topic} {hasGrades ? '⭐' : ''} ({l.quarter}-chorak)
                  </option>
                );
              })}
            </select>
          </div>

          {/* Quick Sub-tab Toggle inside the Sheet: Davomat vs Kunlik Baholash */}
          <div className="flex items-center gap-2 self-start md:self-center">
            <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800">
              <button
                onClick={() => setActiveView('sheet')}
                className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1 cursor-pointer transition-all ${
                  activeView === 'sheet'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3 h-3" />
                <span>Davomat (Ishtirok)</span>
              </button>

              <button
                onClick={() => setActiveView('grading')}
                className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1 cursor-pointer transition-all ${
                  activeView === 'grading'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                    : 'text-amber-400/90 hover:text-amber-300'
                }`}
              >
                <Star className="w-3 h-3 fill-current" />
                <span>Kunlik Baholash</span>
              </button>
            </div>

            {/* Prev / Next buttons */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                disabled={selectedLessonNum <= 1}
                onClick={() => setSelectedLessonNum((prev) => Math.max(1, prev - 1))}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 text-xs cursor-pointer"
                title="Oldingi dars"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                disabled={selectedLessonNum >= 72}
                onClick={() => setSelectedLessonNum((prev) => Math.min(72, prev + 1))}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 text-xs cursor-pointer"
                title="Keyingi dars"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 1: DEDICATED ATTENDANCE SHEET */}
      {activeView === 'sheet' && (
        <div className="space-y-5">
          {activeRecord ? (
            <div className="cyber-glass rounded-xl border border-cyan-500/30 overflow-hidden shadow-2xl">
              {/* Sheet Official Header */}
              <div className="p-6 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/90 border-b border-cyan-500/20">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono-code font-bold">
                        {activeRecord.lessonNumber}-DARS
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs font-mono-code">
                        {curriculumLesson ? `${curriculumLesson.quarter}-CHORAK · ${curriculumLesson.week}-HAFTA (${curriculumLesson.dayOfWeek})` : 'MAKTAB DASTURI'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono-code">
                        ✓ Davomat Beti Faol
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {activeRecord.lessonTopic}
                    </h2>

                    {/* Editable Date */}
                    <div className="flex items-center gap-2 text-xs font-mono-code text-slate-300 pt-1">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Dars O'tkazilgan Sana:</span>
                      <input
                        type="date"
                        value={activeRecord.date}
                        onChange={(e) => handleUpdateSheetDate(e.target.value)}
                        className="bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded px-2 py-0.5 text-xs text-cyan-300 outline-none font-mono-code"
                      />
                    </div>
                  </div>

                  {/* Sheet Top Actions */}
                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      onClick={() => setActiveView('grading')}
                      className="px-3.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(251,191,36,0.4)] cursor-pointer"
                    >
                      <Star className="w-4 h-4 fill-current" />
                      <span>Ushbu Kunga Baho Qo'yish</span>
                    </button>

                    <button
                      onClick={handleMarkAllPresentInSheet}
                      className="px-3.5 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <CheckCheck className="w-4 h-4" />
                      <span>Barchaga 'Keldi'</span>
                    </button>

                    <button
                      onClick={() => setShowPrintModal(true)}
                      className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-cyan-400" />
                      <span>Chop Etish</span>
                    </button>

                    <button
                      onClick={handleDeleteActiveSheet}
                      className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs transition-colors cursor-pointer"
                      title="Ushbu dars davomat betini o'chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sheet KPI Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5 pt-4 border-t border-slate-800/80">
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                    <div className="text-[10px] font-mono-code text-slate-400 uppercase">Jami O'quvchi</div>
                    <div className="text-xl font-bold font-mono-code text-white mt-0.5">{activeTotal} ta</div>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
                    <div className="text-[10px] font-mono-code text-emerald-400 uppercase">Keldi (Ishtirok)</div>
                    <div className="text-xl font-bold font-mono-code text-emerald-300 mt-0.5">{activePresent} ta</div>
                  </div>

                  <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30">
                    <div className="text-[10px] font-mono-code text-rose-400 uppercase">Kelmadi (Yo'q)</div>
                    <div className="text-xl font-bold font-mono-code text-rose-300 mt-0.5">{activeAbsent} ta</div>
                  </div>

                  <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30">
                    <div className="text-[10px] font-mono-code text-amber-400 uppercase">Sababli</div>
                    <div className="text-xl font-bold font-mono-code text-amber-300 mt-0.5">{activeExcused} ta</div>
                  </div>

                  <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 col-span-2 sm:col-span-1">
                    <div className="text-[10px] font-mono-code text-cyan-400 uppercase">Dars Davomati</div>
                    <div className="text-xl font-bold font-mono-code text-cyan-300 mt-0.5">{activeRate}%</div>
                  </div>
                </div>
              </div>

              {/* Student Attendance Sheet Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono-code border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4 w-12 text-center">#</th>
                      <th className="py-3 px-4">O'quvchi</th>
                      <th className="py-3 px-3">Sinfi</th>
                      <th className="py-3 px-4 text-center">Ushbu Darsdagi Davomati</th>
                      <th className="py-3 px-4">Davomat Sababi / Izoh</th>
                      <th className="py-3 px-4 text-center">Bugungi Bahosi</th>
                      <th className="py-3 px-4 text-right">Umumiy Davomat %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredStudents.map((student, idx) => {
                      const status: AttendanceStatus = activeRecord.records[student.id] || 'present';
                      const note = activeRecord.notes?.[student.id];
                      const grade = activeRecord.grades?.[student.id];
                      const cumStats = getStudentCumulativeStats(student.id);

                      return (
                        <tr key={student.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="py-3 px-4 text-center font-mono-code text-slate-500">
                            {idx + 1}
                          </td>

                          {/* Student Info */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center font-mono-code font-bold text-cyan-300 text-xs overflow-hidden shrink-0">
                                {student.avatarUrl ? (
                                  <img src={student.avatarUrl} alt={student.fullName} className="w-full h-full object-cover" />
                                ) : (
                                  student.fullName.charAt(0)
                                )}
                              </div>
                              <div>
                                <div className="font-semibold text-white">{student.fullName}</div>
                                <div className="text-[11px] font-mono-code text-slate-400">
                                  {student.id} · @{student.username}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Grade */}
                          <td className="py-3 px-3 text-slate-300 font-mono-code whitespace-nowrap">
                            {student.grade}
                          </td>

                          {/* Status buttons */}
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5 p-1 rounded-lg bg-slate-950 border border-slate-800">
                              <button
                                onClick={() => handleSetStudentStatus(student.id, 'present')}
                                className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                                  status === 'present'
                                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.5)] font-bold'
                                    : 'text-slate-400 hover:text-emerald-400'
                                }`}
                                title="Keldi"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Keldi</span>
                              </button>

                              <button
                                onClick={() => handleSetStudentStatus(student.id, 'absent')}
                                className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                                  status === 'absent'
                                    ? 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.5)] font-bold'
                                    : 'text-slate-400 hover:text-rose-400'
                                }`}
                                title="Kelmadi"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Kelmadi</span>
                              </button>

                              <button
                                onClick={() => handleSetStudentStatus(student.id, 'excused')}
                                className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                                  status === 'excused'
                                    ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.5)] font-bold'
                                    : 'text-slate-400 hover:text-amber-400'
                                }`}
                                title="Sababli"
                              >
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>Sababli</span>
                              </button>
                            </div>
                          </td>

                          {/* Reason / Note */}
                          <td className="py-3 px-4">
                            {editingNoteStudentId === student.id ? (
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  placeholder="Sabab (masalan: Betob)..."
                                  value={noteInput}
                                  onChange={(e) => setNoteInput(e.target.value)}
                                  className="bg-slate-900 border border-cyan-400 rounded px-2 py-1 text-xs text-white focus:outline-none w-44"
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleSaveStudentNote(student.id)}
                                  className="px-2 py-1 rounded bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer"
                                >
                                  Saqlash
                                </button>
                                <button
                                  onClick={() => setEditingNoteStudentId(null)}
                                  className="px-2 py-1 rounded bg-slate-800 text-slate-400 text-xs cursor-pointer"
                                >
                                  Bekor
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                {note ? (
                                  <span className="text-amber-300 text-[11px] font-mono-code bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                                    {note}
                                  </span>
                                ) : (
                                  <span className="text-slate-500 text-[11px] italic">Izoh yo'q</span>
                                )}
                                <button
                                  onClick={() => {
                                    setEditingNoteStudentId(student.id);
                                    setNoteInput(note || '');
                                  }}
                                  className="text-slate-500 hover:text-cyan-400 p-0.5 rounded cursor-pointer"
                                  title="Izoh qo'shish yoki tahrirlash"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </td>

                          {/* Today's Grade preview with link to grading view */}
                          <td className="py-3 px-4 text-center">
                            {grade ? (
                              <button
                                onClick={() => setActiveView('grading')}
                                className="px-2.5 py-1 rounded bg-amber-400/20 border border-amber-400/50 text-amber-300 font-bold font-mono-code text-xs inline-flex items-center gap-1 hover:bg-amber-400/30 cursor-pointer"
                                title="Baholash bo'limiga o'tish"
                              >
                                <Star className="w-3 h-3 fill-current text-amber-400" />
                                <span>{grade} baho</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => setActiveView('grading')}
                                className="text-slate-500 hover:text-amber-300 text-[11px] font-mono-code underline cursor-pointer"
                              >
                                + Baho qo'yish
                              </button>
                            )}
                          </td>

                          {/* Cumulative attendance % */}
                          <td className="py-3 px-4 text-right whitespace-nowrap font-mono-code">
                            <span className={`font-bold ${
                              cumStats.percent >= 90
                                ? 'text-emerald-400'
                                : cumStats.percent >= 75
                                ? 'text-cyan-400'
                                : 'text-rose-400'
                            }`}>
                              {cumStats.percent}%
                            </span>
                            <span className="text-[10px] text-slate-500 ml-1.5">
                              ({cumStats.present}/{cumStats.total})
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Sheet Footer */}
              <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono-code text-slate-400">
                <span>Maktab #45 Sun'iy Intellekt Kursi · Mas'ul ustoz: M.Xo'jayev</span>
                <span className="text-cyan-400/80">O'zgarishlar avtomatik saqlandi</span>
              </div>
            </div>
          ) : (
            <div className="cyber-glass rounded-xl p-8 border border-dashed border-cyan-500/40 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center mx-auto text-cyan-400">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="max-w-lg mx-auto space-y-2">
                <div className="text-xs font-mono-code text-cyan-400 uppercase">
                  {selectedLessonNum}-DARS ({curriculumLesson?.quarter || 1}-CHORAK)
                </div>
                <h3 className="text-xl font-bold text-white">
                  {curriculumLesson?.topic || `${selectedLessonNum}-dars mavzusi`}
                </h3>
                <p className="text-sm text-slate-400">
                  Ushbu dars uchun hali davomat betligi ochilmagan.
                </p>
              </div>
              <button
                onClick={() => handleOpenSheetForLesson(selectedLessonNum, 'sheet')}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm inline-flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.45)] transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ushbu Mavzuning Davomat Betini Ochish</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: DEDICATED DAILY LESSON GRADING (BAHOLASH BO'LIMI) */}
      {activeView === 'grading' && (
        <div className="space-y-5">
          {activeRecord ? (
            <div className="cyber-glass rounded-xl border border-amber-500/40 overflow-hidden shadow-2xl">
              {/* Grading Official Header */}
              <div className="p-6 bg-gradient-to-r from-slate-900/95 via-amber-950/20 to-slate-900/95 border-b border-amber-500/30">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-mono-code font-bold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>KUNLIK BAHOLASH · {activeRecord.lessonNumber}-DARS</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs font-mono-code">
                        Sana: {activeRecord.date}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs font-mono-code">
                        {curriculumLesson ? `${curriculumLesson.quarter}-chorak (${curriculumLesson.dayOfWeek})` : ''}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                      <span>{activeRecord.lessonTopic}</span>
                    </h2>
                    <p className="text-xs text-amber-300/80 font-mono-code">
                      Har bir o'quvchining bugungi darsdagi faolligi, amaliy mashg'ulotdagi ishtiroki va o'zlashtirishini baholang.
                    </p>
                  </div>

                  {/* Bulk grade actions */}
                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      onClick={() => handleSetBulkGrade(5)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>Hammaga 5 (A'lo)</span>
                    </button>

                    <button
                      onClick={() => handleSetBulkGrade(4)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>Hammaga 4 (Yaxshi)</span>
                    </button>

                    <button
                      onClick={handleClearAllGrades}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 border border-slate-700 text-slate-400 hover:text-rose-400 text-xs transition-colors cursor-pointer"
                      title="Bugungi baholarni tozalash"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Grading KPI stats */}
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mt-5 pt-4 border-t border-slate-800/80">
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                    <div className="text-[10px] font-mono-code text-slate-400 uppercase">Baholangan</div>
                    <div className="text-lg font-bold font-mono-code text-white mt-0.5">
                      {activeGradedCount} / {students.length}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/40">
                    <div className="text-[10px] font-mono-code text-amber-400 uppercase">O'rtacha Baho</div>
                    <div className="text-xl font-bold font-mono-code text-amber-300 mt-0.5 flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current text-amber-400" />
                      <span>{activeAvgGrade}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
                    <div className="text-[10px] font-mono-code text-emerald-400 uppercase">5 Baho (A'lo)</div>
                    <div className="text-lg font-bold font-mono-code text-emerald-300 mt-0.5">{count5} ta</div>
                  </div>

                  <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30">
                    <div className="text-[10px] font-mono-code text-cyan-400 uppercase">4 Baho (Yaxshi)</div>
                    <div className="text-lg font-bold font-mono-code text-cyan-300 mt-0.5">{count4} ta</div>
                  </div>

                  <div className="p-3 rounded-lg bg-yellow-950/30 border border-yellow-500/30">
                    <div className="text-[10px] font-mono-code text-yellow-400 uppercase">3 (Qoniqarli)</div>
                    <div className="text-lg font-bold font-mono-code text-yellow-300 mt-0.5">{count3} ta</div>
                  </div>

                  <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30">
                    <div className="text-[10px] font-mono-code text-rose-400 uppercase">2 (Qoniqarsiz)</div>
                    <div className="text-lg font-bold font-mono-code text-rose-300 mt-0.5">{count2} ta</div>
                  </div>
                </div>
              </div>

              {/* Student Grading Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/95 text-slate-400 uppercase font-mono-code border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4 w-12 text-center">#</th>
                      <th className="py-3 px-4">O'quvchi</th>
                      <th className="py-3 px-3">Sinfi</th>
                      <th className="py-3 px-3 text-center">Davomati</th>
                      <th className="py-3 px-4 text-center">Dars Bahosini Tanlang (1-klikda)</th>
                      <th className="py-3 px-4">Ustoz Izohi / Darsdagi Faollik</th>
                      <th className="py-3 px-4 text-right">O'rtacha Bahosi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredStudents.map((student, idx) => {
                      const status: AttendanceStatus = activeRecord.records[student.id] || 'present';
                      const grade = activeRecord.grades?.[student.id];
                      const comment = activeRecord.gradeComments?.[student.id];
                      const avgGrade = getStudentAverageGrade(student.id);

                      return (
                        <tr key={student.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="py-3 px-4 text-center font-mono-code text-slate-500">
                            {idx + 1}
                          </td>

                          {/* Student Info */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center font-mono-code font-bold text-cyan-300 text-xs overflow-hidden shrink-0">
                                {student.avatarUrl ? (
                                  <img src={student.avatarUrl} alt={student.fullName} className="w-full h-full object-cover" />
                                ) : (
                                  student.fullName.charAt(0)
                                )}
                              </div>
                              <div>
                                <div className="font-semibold text-white">{student.fullName}</div>
                                <div className="text-[11px] font-mono-code text-slate-400">
                                  {student.id} · @{student.username}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Grade */}
                          <td className="py-3 px-3 text-slate-300 font-mono-code whitespace-nowrap">
                            {student.grade}
                          </td>

                          {/* Attendance Status */}
                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold ${
                                status === 'present'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : status === 'absent'
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {status === 'present' ? '✓ Kelgan' : status === 'absent' ? '✕ Kelmagan' : '⚠ Sababli'}
                            </span>
                          </td>

                          {/* Quick Grade Buttons: 5, 4, 3, 2 */}
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
                              {/* 5 Baho - A'lo */}
                              <button
                                onClick={() => handleSetStudentGrade(student.id, 5)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                  grade === 5
                                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.6)] scale-105'
                                    : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-950/40'
                                }`}
                                title="5 baho (A'lo)"
                              >
                                <Star className={`w-3.5 h-3.5 ${grade === 5 ? 'fill-current' : ''}`} />
                                <span>5 (A'lo)</span>
                              </button>

                              {/* 4 Baho - Yaxshi */}
                              <button
                                onClick={() => handleSetStudentGrade(student.id, 4)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                  grade === 4
                                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.6)] scale-105'
                                    : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-950/40'
                                }`}
                                title="4 baho (Yaxshi)"
                              >
                                <Star className={`w-3.5 h-3.5 ${grade === 4 ? 'fill-current' : ''}`} />
                                <span>4 (Yaxshi)</span>
                              </button>

                              {/* 3 Baho - Qoniqarli */}
                              <button
                                onClick={() => handleSetStudentGrade(student.id, 3)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                  grade === 3
                                    ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.6)] scale-105'
                                    : 'text-slate-400 hover:text-amber-400 hover:bg-amber-950/40'
                                }`}
                                title="3 baho (Qoniqarli)"
                              >
                                <Star className={`w-3.5 h-3.5 ${grade === 3 ? 'fill-current' : ''}`} />
                                <span>3 (Qoniqarli)</span>
                              </button>

                              {/* 2 Baho - Qoniqarsiz */}
                              <button
                                onClick={() => handleSetStudentGrade(student.id, 2)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                  grade === 2
                                    ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.6)] scale-105'
                                    : 'text-slate-400 hover:text-rose-400 hover:bg-rose-950/40'
                                }`}
                                title="2 baho (Qoniqarsiz)"
                              >
                                <span>2</span>
                              </button>
                            </div>
                          </td>

                          {/* Teacher's Daily Comment / Feedback */}
                          <td className="py-3 px-4">
                            {editingCommentStudentId === student.id ? (
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="text"
                                    placeholder="Izoh yozing (masalan: Faol qatnashdi)..."
                                    value={commentInput}
                                    onChange={(e) => setCommentInput(e.target.value)}
                                    className="bg-slate-900 border border-amber-400 rounded px-2.5 py-1 text-xs text-white focus:outline-none w-56"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => handleSaveGradeComment(student.id, commentInput)}
                                    className="px-2.5 py-1 rounded bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                                  >
                                    Saqlash
                                  </button>
                                  <button
                                    onClick={() => setEditingCommentStudentId(null)}
                                    className="px-2 py-1 rounded bg-slate-800 text-slate-400 text-xs cursor-pointer"
                                  >
                                    Bekor
                                  </button>
                                </div>

                                {/* Quick feedback chips */}
                                <div className="flex flex-wrap gap-1">
                                  {[
                                    "Faol qatnashdi",
                                    "Amaliy ishni a'lo bajardi",
                                    "Mustaqil prompt yozdi",
                                    "Mavzuni to'liq tushundi",
                                  ].map((chip) => (
                                    <button
                                      key={chip}
                                      type="button"
                                      onClick={() => setCommentInput(chip)}
                                      className="text-[10px] bg-slate-800 hover:bg-amber-400/20 text-slate-300 hover:text-amber-300 px-1.5 py-0.5 rounded border border-slate-700 cursor-pointer"
                                    >
                                      {chip}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                {comment ? (
                                  <span className="text-amber-200 text-xs bg-amber-950/30 px-2 py-1 rounded border border-amber-500/30 flex items-center gap-1">
                                    <MessageSquare className="w-3 h-3 text-amber-400 shrink-0" />
                                    <span>{comment}</span>
                                  </span>
                                ) : (
                                  <span className="text-slate-500 text-xs italic">Izoh yo'q</span>
                                )}
                                <button
                                  onClick={() => {
                                    setEditingCommentStudentId(student.id);
                                    setCommentInput(comment || '');
                                  }}
                                  className="text-slate-500 hover:text-amber-400 p-1 rounded cursor-pointer"
                                  title="Izoh qo'shish yoki tahrirlash"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </td>

                          {/* Cumulative Average Grade */}
                          <td className="py-3 px-4 text-right whitespace-nowrap font-mono-code font-bold">
                            <span className="text-amber-300 flex items-center justify-end gap-1">
                              <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                              <span>{avgGrade}</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Grading Footer */}
              <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono-code text-slate-400">
                <span className="text-amber-300/90 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Har bir kunga qo'yilgan baholar avtomatik saqlanadi</span>
                </span>
                <span className="text-slate-500">Maktab #45 · M.Xo'jayev</span>
              </div>
            </div>
          ) : (
            <div className="cyber-glass rounded-xl p-8 border border-dashed border-amber-500/40 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
                <Star className="w-7 h-7 fill-current" />
              </div>
              <div className="max-w-lg mx-auto space-y-2">
                <div className="text-xs font-mono-code text-amber-400 uppercase">
                  {selectedLessonNum}-DARS BAHOLASH BETI
                </div>
                <h3 className="text-xl font-bold text-white">
                  {curriculumLesson?.topic || `${selectedLessonNum}-dars`}
                </h3>
                <p className="text-sm text-slate-400">
                  Ushbu dars uchun hali baholash varag'i ochilmagan.
                </p>
              </div>
              <button
                onClick={() => handleOpenSheetForLesson(selectedLessonNum, 'grading')}
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm inline-flex items-center gap-2 shadow-[0_0_20px_rgba(251,191,36,0.5)] transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ushbu Kunga Baholash Betini Ochish</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: ALL 72 TOPICS CATALOG & SHEET STATUS */}
      {activeView === 'catalog' && (
        <div className="space-y-4">
          <div className="cyber-glass-card rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border border-slate-800">
            {/* Search topic */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Mavzu nomi yoki raqamini qidiring..."
                value={topicSearch}
                onChange={(e) => setTopicSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Quarter filters */}
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
                  onClick={() => setCatalogQuarter(btn.value as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    catalogQuarter === btn.value
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of 72 Topics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredCurriculum.map((lesson) => {
              const rec = attendance.find((a) => a.lessonNumber === lesson.number);
              let presentCount = 0;
              let gradedCount = 0;
              if (rec) {
                Object.values(rec.records).forEach((st) => {
                  if (st === 'present') presentCount++;
                });
                if (rec.grades) {
                  gradedCount = Object.keys(rec.grades).length;
                }
              }

              return (
                <div
                  key={lesson.number}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    rec
                      ? 'bg-slate-900/80 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 font-mono-code text-xs">
                        <span className="font-bold text-cyan-400">#{lesson.number}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-slate-400">{lesson.week}-hafta ({lesson.dayOfWeek})</span>
                      </div>

                      {rec ? (
                        <div className="flex items-center gap-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            ✓ {presentCount}/{students.length} kelgan
                          </span>
                          {gradedCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono-code font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              <span>{gradedCount}</span>
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-slate-800 text-slate-400">
                          Hali ochilmagan
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-semibold text-white leading-snug mb-3">
                      {lesson.topic}
                    </h4>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono-code text-slate-400">
                      {lesson.quarter}-chorak
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenSheetForLesson(lesson.number, 'sheet')}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                          rec
                            ? 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30'
                            : 'bg-slate-800 hover:bg-cyan-500/20 text-slate-300'
                        }`}
                      >
                        <FileText className="w-3 h-3" />
                        <span>Davomat</span>
                      </button>

                      <button
                        onClick={() => handleOpenSheetForLesson(lesson.number, 'grading')}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-[0_0_10px_rgba(251,191,36,0.3)]"
                      >
                        <Star className="w-3 h-3 fill-current" />
                        <span>Baho Qo'yish</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 4: FULL MATRIX (CROSS-TABLE) VIEW */}
      {activeView === 'matrix' && (
        <div className="cyber-glass rounded-xl border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Barcha Mavzular Yig'ma Jurnali (Matrix)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Ochilgan barcha {attendance.length} ta dars mavzusi bo'yicha to'liq davomat va kunlik baholar jadvali
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Matrix Toggle: Attendance vs Grades */}
              <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800">
                <button
                  onClick={() => setMatrixMode('attendance')}
                  className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                    matrixMode === 'attendance'
                      ? 'bg-cyan-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Davomat (K / X / S)
                </button>
                <button
                  onClick={() => setMatrixMode('grades')}
                  className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                    matrixMode === 'grades'
                      ? 'bg-amber-400 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Kunlik Baholar (5, 4, 3)
                </button>
              </div>

              <button
                onClick={() => setShowPrintModal(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-cyan-400" />
                <span>Chop Etish</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/95 sticky top-0 z-20 text-slate-400 uppercase font-mono-code border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 sticky left-0 z-30 bg-slate-900 min-w-[200px] border-r border-slate-800">
                    O'quvchi
                  </th>
                  <th className="py-3 px-3 text-center w-16 border-r border-slate-800">
                    Sinf
                  </th>
                  {attendance.map((rec) => (
                    <th
                      key={rec.lessonNumber}
                      title={`${rec.lessonNumber}-dars: ${rec.lessonTopic} (${rec.date})`}
                      className="py-3 px-2 text-center min-w-[44px] cursor-pointer hover:bg-slate-800/80 transition-colors border-r border-slate-800/40"
                      onClick={() => {
                        setSelectedLessonNum(rec.lessonNumber);
                        setActiveView(matrixMode === 'grades' ? 'grading' : 'sheet');
                      }}
                    >
                      <div className="text-cyan-400 font-bold">#{rec.lessonNumber}</div>
                      <div className="text-[9px] text-slate-500 font-normal">{rec.date.slice(5)}</div>
                    </th>
                  ))}
                  <th className="py-3 px-3 text-center sticky right-0 z-30 bg-slate-900 border-l border-slate-800 min-w-[80px]">
                    {matrixMode === 'grades' ? "O'rtacha Baho" : "Umumiy %"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono-code">
                {students.map((student) => {
                  const cumStats = getStudentCumulativeStats(student.id);
                  const avgGrade = getStudentAverageGrade(student.id);

                  return (
                    <tr key={student.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-2.5 px-4 sticky left-0 z-10 bg-slate-950/90 font-medium text-white whitespace-nowrap border-r border-slate-800">
                        {student.fullName}
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-400 border-r border-slate-800">
                        {student.grade}
                      </td>
                      {attendance.map((rec) => {
                        const st = rec.records[student.id] || 'present';
                        const g = rec.grades?.[student.id];

                        return (
                          <td
                            key={rec.lessonNumber}
                            className="py-2.5 px-1 text-center border-r border-slate-800/30"
                            title={`${student.fullName} — ${rec.lessonNumber}-dars: ${
                              matrixMode === 'grades'
                                ? g ? `${g} baho` : 'Baholanmagan'
                                : st === 'present' ? 'Keldi' : st === 'absent' ? 'Kelmadi' : 'Sababli'
                            }`}
                          >
                            {matrixMode === 'grades' ? (
                              g ? (
                                <span
                                  className={`w-6 h-6 inline-flex items-center justify-center rounded text-[11px] font-bold ${
                                    g === 5
                                      ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                                      : g === 4
                                      ? 'bg-cyan-500 text-slate-950 font-extrabold'
                                      : g === 3
                                      ? 'bg-amber-400 text-slate-950 font-extrabold'
                                      : 'bg-rose-500 text-white font-extrabold'
                                  }`}
                                >
                                  {g}
                                </span>
                              ) : (
                                <span className="text-slate-600 text-[10px]">-</span>
                              )
                            ) : (
                              <span
                                className={`w-6 h-6 inline-flex items-center justify-center rounded text-[11px] font-bold ${
                                  st === 'present'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : st === 'absent'
                                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                }`}
                              >
                                {st === 'present' ? '✓' : st === 'absent' ? '✕' : 'S'}
                              </span>
                            )}
                          </td>
                        );
                      })}
                      <td className="py-2.5 px-3 text-center sticky right-0 z-10 bg-slate-950/90 font-bold border-l border-slate-800">
                        {matrixMode === 'grades' ? (
                          <span className="text-amber-300 font-bold flex items-center justify-center gap-0.5">
                            <Star className="w-3 h-3 fill-current text-amber-400" />
                            <span>{avgGrade}</span>
                          </span>
                        ) : (
                          <span
                            className={
                              cumStats.percent >= 90
                                ? 'text-emerald-400'
                                : cumStats.percent >= 75
                                ? 'text-cyan-400'
                                : 'text-rose-400'
                            }
                          >
                            {cumStats.percent}%
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

      {/* MODAL: ADD / OPEN NEW LESSON SHEET */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="cyber-glass rounded-xl p-6 max-w-lg w-full border border-cyan-500/40 shadow-2xl my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <span>Yangi Dars Davomat & Baholash Betini Ochish</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomLesson} className="space-y-4">
              <div>
                <label className="block text-xs font-mono-code text-cyan-300 mb-1.5 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>72 Soatlik Rejadagi Darsni Tanlash (Avto-to'ldirish):</span>
                </label>
                <select
                  aria-label="Rejadagi darsni tanlash"
                  value={formLessonNum}
                  onChange={(e) => {
                    const num = parseInt(e.target.value);
                    setFormLessonNum(num);
                    const found = CURRICULUM_72_LESSONS.find((l) => l.number === num);
                    if (found) setFormLessonTopic(found.topic);
                  }}
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  {CURRICULUM_72_LESSONS.map((l) => (
                    <option key={l.number} value={l.number}>
                      {l.number}-dars: {l.topic} ({l.quarter}-chorak)
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
                    value={formLessonNum}
                    onChange={(e) => {
                      const num = parseInt(e.target.value) || 1;
                      setFormLessonNum(num);
                      const found = CURRICULUM_72_LESSONS.find((l) => l.number === num);
                      if (found) setFormLessonTopic(found.topic);
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
                    value={formLessonDate}
                    onChange={(e) => setFormLessonDate(e.target.value)}
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
                  value={formLessonTopic}
                  onChange={(e) => setFormLessonTopic(e.target.value)}
                  placeholder="Dars mavzusini kiriting..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-300">
                Ushbu bet ochilganda, dars davomati va <strong>kunlik dars baholari</strong> bir zumda tayyor bo'ladi.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
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
                  Betni Ochish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PRINT PREVIEW */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-xl p-8 max-w-3xl w-full shadow-2xl my-auto space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-950">
                  Maktab #45 — Sun'iy Intellekt Kursi Davomat & Baholash Varakasi
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rasmiy dars jurnali ko'chirmasi
                </p>
              </div>
              <button
                onClick={() => setShowPrintModal(false)}
                className="text-slate-400 hover:text-slate-800 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeRecord && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg text-xs font-mono">
                  <div>
                    <span className="text-slate-500">Dars:</span> <strong>{activeRecord.lessonNumber}-dars</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Sana:</span> <strong>{activeRecord.date}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500">Mavzu:</span> <strong>{activeRecord.lessonTopic}</strong>
                  </div>
                </div>

                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b">
                    <tr>
                      <th className="p-2 border-r text-center w-10">№</th>
                      <th className="p-2 border-r">O'quvchi F.I.Sh</th>
                      <th className="p-2 border-r text-center w-20">Sinfi</th>
                      <th className="p-2 border-r text-center w-24">Davomat</th>
                      <th className="p-2 border-r text-center w-20">Kunlik Baho</th>
                      <th className="p-2">Ustoz Izohi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {students.map((st, i) => {
                      const stStatus = activeRecord.records[st.id] || 'present';
                      const stGrade = activeRecord.grades?.[st.id];
                      const stComment = activeRecord.gradeComments?.[st.id] || activeRecord.notes?.[st.id] || '';

                      return (
                        <tr key={st.id}>
                          <td className="p-2 border-r text-center">{i + 1}</td>
                          <td className="p-2 border-r font-medium">{st.fullName}</td>
                          <td className="p-2 border-r text-center">{st.grade}</td>
                          <td className="p-2 border-r text-center font-bold">
                            {stStatus === 'present' ? 'Keldi' : stStatus === 'absent' ? 'Kelmadi' : 'Sababli'}
                          </td>
                          <td className="p-2 border-r text-center font-bold text-amber-700">
                            {stGrade ? `${stGrade} baho` : '-'}
                          </td>
                          <td className="p-2 text-slate-600">{stComment}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="flex justify-between items-center pt-8 text-xs font-serif text-slate-700">
                  <div>
                    <div>Kurs O'qituvchisi: <strong>M.Xo'jayev</strong></div>
                    <div className="text-[10px] text-slate-400">Imzo: _______________</div>
                  </div>
                  <div>
                    <div>Maktab O'quv Islari Mudiri: _______________</div>
                    <div className="text-[10px] text-slate-400">Imzo / Muhr</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Yopish
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Chop Etish</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
