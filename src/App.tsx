/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Student,
  AttendanceRecord,
  Homework,
  StudentSubmission,
  ActiveTab,
  UserRole,
  AppToast,
} from './types';
import { ToastContainer } from './components/ToastContainer';
import { BellPermissionModal } from './components/BellPermissionModal';
import {
  playBellSound,
  showSystemNotification,
  registerServiceWorker,
} from './utils/audioNotification';
import {
  INITIAL_STUDENTS,
  INITIAL_ATTENDANCE,
  INITIAL_HOMEWORK,
  INITIAL_SUBMISSIONS,
  DEFAULT_COMPLETED_LESSONS,
} from './data/initialData';
import { CyberBackground3D } from './components/CyberBackground3D';
import { TopNav } from './components/TopNav';
import { DashboardStats } from './components/DashboardStats';
import { AttendanceTracker } from './components/AttendanceTracker';
import { StudentsManager } from './components/StudentsManager';
import { ScheduleAndHomework } from './components/ScheduleAndHomework';
import { StudentPortal } from './components/StudentPortal';
import { CertificateGenerator } from './components/CertificateGenerator';
import { LoginModal } from './components/LoginModal';
import { LoginScreen } from './components/LoginScreen';
import { MonthlyPaymentsManager } from './components/MonthlyPaymentsManager';

export default function App() {
  // State with LocalStorage Persistence (v4_clean)
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('maktab45_ai_students_clean_v4');
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem('maktab45_ai_attendance_clean_v4');
      return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
    } catch {
      return INITIAL_ATTENDANCE;
    }
  });

  const [homework, setHomework] = useState<Homework[]>(() => {
    try {
      const saved = localStorage.getItem('maktab45_ai_homework_clean_v4');
      return saved ? JSON.parse(saved) : INITIAL_HOMEWORK;
    } catch {
      return INITIAL_HOMEWORK;
    }
  });

  const [submissions, setSubmissions] = useState<StudentSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('maktab45_ai_submissions_clean_v4');
      return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  });

  // 72 Darslik o'quv rejasining o'tilganlik holati (Default: 5-hafta Dushanbagacha, 1-9 darslar)
  const [completedLessons, setCompletedLessons] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('maktab45_ai_completed_lessons_v4');
      return saved ? JSON.parse(saved) : DEFAULT_COMPLETED_LESSONS;
    } catch {
      return DEFAULT_COMPLETED_LESSONS;
    }
  });

  // Authentication State: har doim tizimga kirish (Login) oynasida ochiladi
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<UserRole>('admin');
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Modals state
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [selectedStudentForCert, setSelectedStudentForCert] = useState<string>(
    students[0]?.fullName || ''
  );

  // Animated Toast notifications state
  const [toasts, setToasts] = useState<AppToast[]>([]);

  // Sound and Bell permission state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('maktab45_sound_enabled_v5');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [isBellModalOpen, setIsBellModalOpen] = useState<boolean>(false);

  // Saytga kirishi bilan bildirishnoma va qo'ng'iroqqa ruxsat so'rash (2-rasmdagidek)
  useEffect(() => {
    // Service workerni orqa fonda xabarnoma chiqarish uchun ro'yxatdan o'tkazamiz
    registerServiceWorker().catch(() => {});

    const alreadyDecided = localStorage.getItem('maktab45_bell_permission_asked_v6');
    if (!alreadyDecided) {
      const timer = setTimeout(() => {
        setIsBellModalOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Boshqa ochiq tablar / oynalar o'rtasida real-vaqt sinxronlash
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;
    const channel = new BroadcastChannel('maktab45_live_sync');
    channel.onmessage = (event) => {
      const data = event.data;
      if (data && data.type === 'SYNC_TOAST' && data.toast) {
        setToasts((prev) => [data.toast, ...prev].slice(0, 5));
        if (soundEnabled) {
          showSystemNotification({
            title: data.toast.title,
            body: data.toast.message,
            type: data.toast.type,
            tag: data.toast.id,
          });
        }
      }
    };
    return () => {
      channel.close();
    };
  }, [soundEnabled]);

  const handleAllowBell = () => {
    setSoundEnabled(true);
    localStorage.setItem('maktab45_sound_enabled_v5', 'true');
    localStorage.setItem('maktab45_bell_permission_asked_v6', 'true');
    setIsBellModalOpen(false);
    playBellSound('success');
    pushToast({
      type: 'success',
      title: "Bildirishnomalar va Qo'ng'iroq Yoqildi! 🔔",
      message: "Saytdan tashqarida bo'lsangiz ham yangi vazifalar va baholar ekranga chiqadi.",
      duration: 5000,
    });
  };

  const handleDenyBell = () => {
    setSoundEnabled(false);
    localStorage.setItem('maktab45_sound_enabled_v5', 'false');
    localStorage.setItem('maktab45_bell_permission_asked_v6', 'true');
    setIsBellModalOpen(false);
  };

  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    localStorage.setItem('maktab45_sound_enabled_v5', JSON.stringify(nextVal));
    if (nextVal) {
      playBellSound('success');
      pushToast({
        type: 'info',
        title: "Qo'ng'iroq yoqildi 🔔",
        message: "Bildirishnoma qo'ng'irog'i faollashtirildi (saytdan tashqarida ham chiqadi).",
        duration: 3000,
      });
    }
  };

  const pushToast = (toast: Omit<AppToast, 'id'>, broadcast: boolean = true) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: AppToast = {
      ...toast,
      id,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 5)); // Keep max 5 active toasts

    // Saytdan tashqarida (boshqa oynada / fonda) tursangiz ham chiqadigan tizim bildirishnomasi & qo'ng'iroq
    if (soundEnabled) {
      const soundType =
        toast.type === 'grade'
          ? 'grade'
          : toast.type === 'homework'
          ? 'homework'
          : toast.type === 'success'
          ? 'success'
          : toast.type === 'warning'
          ? 'warning'
          : 'generic';

      showSystemNotification({
        title: toast.title,
        body: toast.message,
        type: soundType,
        tag: id,
      });
    }

    // Boshqa ochiq tablar / fondagi oynalarga uzatish
    if (broadcast && typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const channel = new BroadcastChannel('maktab45_live_sync');
        channel.postMessage({ type: 'SYNC_TOAST', toast: newToast });
        channel.close();
      } catch {
        // ignore
      }
    }
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Save to LocalStorage on updates
  useEffect(() => {
    try {
      localStorage.setItem('maktab45_ai_students_clean_v4', JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save students to localStorage', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem('maktab45_ai_attendance_clean_v4', JSON.stringify(attendance));
    } catch (e) {
      console.error('Failed to save attendance to localStorage', e);
    }
  }, [attendance]);

  useEffect(() => {
    try {
      localStorage.setItem('maktab45_ai_homework_clean_v4', JSON.stringify(homework));
    } catch (e) {
      console.error('Failed to save homework to localStorage', e);
    }
  }, [homework]);

  useEffect(() => {
    try {
      localStorage.setItem('maktab45_ai_submissions_clean_v4', JSON.stringify(submissions));
    } catch (e) {
      console.error('Failed to save submissions to localStorage', e);
    }
  }, [submissions]);

  useEffect(() => {
    try {
      localStorage.setItem('maktab45_ai_completed_lessons_v4', JSON.stringify(completedLessons));
    } catch (e) {
      console.error('Failed to save completed lessons to localStorage', e);
    }
  }, [completedLessons]);

  // Auth Handlers
  const handleLoginSuccess = (newRole: UserRole, student?: Student) => {
    setIsAuthenticated(true);
    setRole(newRole);
    if (newRole === 'student' && student) {
      setActiveStudent(student);
      setActiveTab('portal');
    } else {
      setActiveTab('overview');
    }
    setIsLoginModalOpen(false);

    // Kirganda qo'ng'iroqqa ruxsat so'rash
    const asked = localStorage.getItem('maktab45_bell_permission_asked_v5');
    if (!asked) {
      setTimeout(() => {
        setIsBellModalOpen(true);
      }, 400);
    } else if (soundEnabled) {
      playBellSound('success');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveStudent(null);
    setRole('admin');
    setActiveTab('overview');
    setIsLoginModalOpen(false);
  };

  // Oylik to'lov eslatmasi (Ustoz tasdiqlamaguncha davriy eslatib turadi):
  // "bu oyni oylik to'lovin qilin deb hamayta versin qchon men tasdiqlasam to'lov qildi deb keyin to'xsin xar oyning beshinchi sanasigacha to'lanishi kerg desin"
  useEffect(() => {
    if (!isAuthenticated || role !== 'student' || !activeStudent) return;

    const currentMonthKey = 'oktyabr';
    const payment = activeStudent.monthlyPayments?.[currentMonthKey];
    const isPaid = payment?.status === 'paid' || payment?.status === 'scholarship';

    if (!isPaid) {
      const sendPaymentWarning = () => {
        pushToast({
          type: 'warning',
          title: "⚠️ Oylik To'lov Eslatmasi (Oktyabr oyi)",
          message:
            "Hurmatli o'quvchi, ushbu oyning to'lovini to'lang! To'lov har oyning 5-sanasigacha to'lanishi kerak. Ustoz tizimda tasdiqlamaguncha ushbu eslatma to'xtamaydi.",
          duration: 9000,
        });
      };

      // Tizimga kirganda 1.5 soniyadan so'ng va har 80 soniyada takroran eslatadi
      const initialTimer = setTimeout(sendPaymentWarning, 1500);
      const recurringInterval = setInterval(sendPaymentWarning, 80000);

      return () => {
        clearTimeout(initialTimer);
        clearInterval(recurringInterval);
      };
    }
  }, [isAuthenticated, role, activeStudent]);

  // Handlers for Students CRUD
  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
    if (!activeStudent) {
      setActiveStudent(newStudent);
    }
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    const prevStudent = students.find((s) => s.id === updatedStudent.id);
    const wasPending = prevStudent?.monthlyPayments?.oktyabr?.status !== 'paid';
    const nowPaid = updatedStudent.monthlyPayments?.oktyabr?.status === 'paid';

    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    if (activeStudent?.id === updatedStudent.id) {
      setActiveStudent(updatedStudent);
    }

    // Ustoz to'lovni tasdiqlaganda bildirishnoma va to'xtatish xabari
    if (wasPending && nowPaid) {
      pushToast({
        type: 'success',
        title: "To'lov Tasdiqlandi! ✅",
        message: `${updatedStudent.fullName} uchun Oktyabr oyi to'lovi qabul qilindi. Oylik to'lov eslatmasi to'xtatildi!`,
        duration: 5000,
      });
    }
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    if (activeStudent?.id === studentId) {
      const remaining = students.filter((s) => s.id !== studentId);
      setActiveStudent(remaining.length > 0 ? remaining[0] : null);
    }
  };

  // Handlers for Attendance
  const handleUpdateAttendance = (newAttendance: AttendanceRecord[]) => {
    setAttendance(newAttendance);
  };

  // Handlers for Homework & Submissions
  const handleAddHomework = (newHw: Homework) => {
    setHomework((prev) => [...prev, newHw]);
    pushToast({
      type: 'homework',
      title: "Yangi Uy Vazifasi Yuklandi!",
      message: `"${newHw.title}" — ${newHw.moduleName}. Maksimal: ${newHw.maxScore} ball.`,
    });
  };

  const handleSubmitHomework = (newSub: StudentSubmission) => {
    setSubmissions((prev) => {
      const filtered = prev.filter(
        (s) => !(s.homeworkId === newSub.homeworkId && s.studentId === newSub.studentId)
      );
      return [...filtered, newSub];
    });

    const targetHw = homework.find((h) => h.id === newSub.homeworkId);
    const targetStudent = students.find((s) => s.id === newSub.studentId);
    pushToast({
      type: 'success',
      title: "Vazifa Muvaffaqiyatli Topshirildi!",
      message: `${targetStudent?.fullName || 'O\'quvchi'} tomonidan "${targetHw?.title || newSub.homeworkId}" topshirildi.`,
    });
  };

  const handleGradeSubmission = (subId: string, score: number, feedback: string) => {
    let studentName = '';
    let hwTitle = '';

    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === subId) {
          const st = students.find((std) => std.id === s.studentId);
          const hw = homework.find((h) => h.id === s.homeworkId);
          studentName = st?.fullName || s.studentId;
          hwTitle = hw?.title || s.homeworkId;
          return { ...s, score, feedback, status: 'graded' };
        }
        return s;
      })
    );

    const gradeLevel = score >= 86 ? "A'lo" : score >= 71 ? "Yaxshi" : score >= 56 ? "Qoniqarli" : "Qoniqarsiz";
    pushToast({
      type: 'grade',
      title: `Baho Qo'yildi: ${score} / 100 ball (${gradeLevel})!`,
      message: `${studentName} uchun "${hwTitle}" baholandi. Izoh: "${feedback}"`,
      duration: 8000,
    });
  };

  // Ustoz to'g'ridan-to'g'ri o'quvchiga baho qo'yishi
  const handleDirectGrade = (studentId: string, homeworkId: string, score: number, feedback: string) => {
    const student = students.find((s) => s.id === studentId);
    const hw = homework.find((h) => h.id === homeworkId);

    const existingSubIndex = submissions.findIndex(
      (s) => s.studentId === studentId && s.homeworkId === homeworkId
    );

    if (existingSubIndex >= 0) {
      setSubmissions((prev) =>
        prev.map((s, idx) =>
          idx === existingSubIndex
            ? { ...s, score, feedback, status: 'graded' }
            : s
        )
      );
    } else {
      const newSub: StudentSubmission = {
        id: `SUB-${Date.now().toString().slice(-4)}`,
        homeworkId,
        studentId,
        submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        content: "Darsda bevosita topshirilgan / Ustoz tomonidan baholangan",
        score,
        feedback,
        status: 'graded',
      };
      setSubmissions((prev) => [...prev, newSub]);
    }

    const gradeLevel = score >= 86 ? "A'lo" : score >= 71 ? "Yaxshi" : score >= 56 ? "Qoniqarli" : "Qoniqarsiz";
    pushToast({
      type: 'grade',
      title: `Yangi Baho Qo'yildi: ${score} / 100 ball (${gradeLevel})!`,
      message: `${student?.fullName || studentId} uchun "${hw?.title || homeworkId}" baholandi. Izoh: "${feedback}"`,
      duration: 8000,
    });
  };

  // Switch to student portal for specific student
  const handleSelectStudentForPortal = (st: Student) => {
    setActiveStudent(st);
    setRole('student');
    setActiveTab('portal');
  };

  // Switch to certificate for specific student
  const handleSelectStudentForCertificate = (st: Student) => {
    setSelectedStudentForCert(st.fullName);
    setActiveTab('certificate');
  };

  // Handlers for Curriculum Lesson Progression
  const handleToggleCompletedLesson = (lessonNumber: number) => {
    setCompletedLessons((prev) => {
      if (prev.includes(lessonNumber)) {
        return prev.filter((n) => n !== lessonNumber);
      } else {
        return [...prev, lessonNumber].sort((a, b) => a - b);
      }
    });
  };

  const handleSetCompletedLessons = (lessons: number[]) => {
    setCompletedLessons(lessons);
  };

  // Clear all data (Toza holatga qaytarish)
  const handleClearAllData = () => {
    if (window.confirm("Haqiqatan ham barcha o'quvchilar, davomat va vazifalar o'chirilib, toza holatga keltirilsinmi?")) {
      setStudents([]);
      setAttendance([]);
      setHomework([]);
      setSubmissions([]);
      setActiveStudent(null);
      setCompletedLessons(DEFAULT_COMPLETED_LESSONS);
      localStorage.removeItem('maktab45_ai_students_clean_v4');
      localStorage.removeItem('maktab45_ai_attendance_clean_v4');
      localStorage.removeItem('maktab45_ai_homework_clean_v4');
      localStorage.removeItem('maktab45_ai_submissions_clean_v4');
      localStorage.removeItem('maktab45_ai_completed_lessons_v4');
      localStorage.removeItem('maktab45_ai_students_v2');
      localStorage.removeItem('maktab45_ai_attendance_v2');
      localStorage.removeItem('maktab45_ai_homework_v2');
      localStorage.removeItem('maktab45_ai_submissions_v2');
      alert("Baza to'liq tozalandi! Endi o'zingiz yangi o'quvchilarni kiritishingiz mumkin.");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#04060f] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 flex flex-col font-sans">
      {/* Three.js Cyber Ambient 3D Canvas Background */}
      <CyberBackground3D />

      {/* Cyber OS Top Navigation */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role={role}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        activeStudent={activeStudent}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenSoundPermission={() => setIsBellModalOpen(true)}
      />

      {/* Agar tizimga kirmagan bo'lsa, LoginScreen ochiladi */}
      {!isAuthenticated ? (
        <LoginScreen
          students={students}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Banner if in Student Mode */}
        {role === 'student' && activeStudent && activeTab !== 'portal' && (
          <div className="mb-6 p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs text-cyan-300">
            <span>
              Hozirda <strong>{activeStudent.fullName}</strong> (@{activeStudent.username}) o'quvchi kabineti faol.
            </span>
            <button
              onClick={() => setActiveTab('portal')}
              className="underline font-semibold hover:text-white cursor-pointer"
            >
              Shaxsiy kabinetga qaytish
            </button>
          </div>
        )}

        {/* Tab 1: Overview Dashboard (Admin) */}
        {activeTab === 'overview' && (
          <DashboardStats
            students={students}
            attendance={attendance}
            homework={homework}
            submissions={submissions}
            completedLessons={completedLessons}
            setActiveTab={setActiveTab}
            onOpenAddStudent={() => setIsAddStudentModalOpen(true)}
            onLogout={handleLogout}
          />
        )}

        {/* Tab 2: Attendance Journal */}
        {activeTab === 'attendance' && (
          <AttendanceTracker
            students={students}
            attendance={attendance}
            onUpdateAttendance={handleUpdateAttendance}
          />
        )}

        {/* Tab 3: Students Database & Credential Management (CRUD) */}
        {activeTab === 'students' && (
          <StudentsManager
            students={students}
            attendance={attendance}
            submissions={submissions}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            onSelectStudentForPortal={handleSelectStudentForPortal}
            onSelectStudentForCertificate={handleSelectStudentForCertificate}
            isAddModalOpen={isAddStudentModalOpen}
            setIsAddModalOpen={setIsAddStudentModalOpen}
          />
        )}

        {/* Tab 3.5: Monthly Payments Management */}
        {activeTab === 'payments' && (
          <MonthlyPaymentsManager
            students={students}
            onUpdateStudent={handleUpdateStudent}
          />
        )}

        {/* Tab 4: 72 Lessons Curriculum & Homework */}
        {activeTab === 'schedule' && (
          <ScheduleAndHomework
            homework={homework}
            submissions={submissions}
            students={students}
            role={role}
            activeStudent={activeStudent}
            completedLessons={completedLessons}
            onToggleCompletedLesson={handleToggleCompletedLesson}
            onSetCompletedLessons={handleSetCompletedLessons}
            onAddHomework={handleAddHomework}
            onSubmitHomework={handleSubmitHomework}
            onGradeSubmission={handleGradeSubmission}
            onDirectGrade={handleDirectGrade}
          />
        )}

        {/* Tab 5: Student Portal (Shaxsiy Kabinet) */}
        {activeTab === 'portal' && (
          <StudentPortal
            student={activeStudent}
            allStudents={students}
            onSelectStudent={(st) => setActiveStudent(st)}
            attendance={attendance}
            homework={homework}
            submissions={submissions}
            onSubmitHomework={handleSubmitHomework}
            setActiveTab={setActiveTab}
            onLogout={handleLogout}
            onOpenCertificateForMe={() => {
              if (activeStudent) {
                setSelectedStudentForCert(activeStudent.fullName);
                setActiveTab('certificate');
              }
            }}
          />
        )}

        {/* Tab 6: Certificate Generator */}
        {activeTab === 'certificate' && (
          <CertificateGenerator
            students={students}
            initialStudentName={selectedStudentForCert}
          />
        )}
        </main>
      )}

      {/* Login Modal (agar tizim ichida turib hisob almashtirilsa) */}
      <LoginModal
        students={students}
        isOpen={isLoginModalOpen}
        onLoginSuccess={handleLoginSuccess}
        onClose={() => setIsLoginModalOpen(false)}
        allowClose={true}
      />

      {/* Interaktiv Animatsiyali Bildirishnomalar (Toast) */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Qo'ng'iroq va Ovozli Bildirishnoma Ruxsat Oynasi */}
      <BellPermissionModal
        isOpen={isBellModalOpen}
        onAllow={handleAllowBell}
        onDeny={handleDenyBell}
      />

      {/* Cyber OS Minimal Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-[#04060f]/90 py-5 text-center text-xs text-slate-500 font-mono-code">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>45-SONLI MAKTAB · USTOZ M.XO'JAYEV SUN'IY INTELLEKT KURSI (72 SOAT)</div>
          <div className="flex items-center gap-4">
            {role === 'admin' && (
              <button
                onClick={handleClearAllData}
                className="text-rose-400 hover:text-rose-300 underline cursor-pointer text-[11px]"
                title="Barcha ma'lumotlarni tozalash"
              >
                Bazani tozalash (Reset)
              </button>
            )}
            <span>CYBER OS v2.9 · TOZA BAZA REJIMI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
