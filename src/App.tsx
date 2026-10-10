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
} from './types';
import {
  INITIAL_STUDENTS,
  INITIAL_ATTENDANCE,
  INITIAL_HOMEWORK,
  INITIAL_SUBMISSIONS,
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
import { MonthlyPaymentsManager } from './components/MonthlyPaymentsManager';

export default function App() {
  // State with LocalStorage Persistence
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('maktab45_ai_students_v2');
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem('maktab45_ai_attendance_v2');
      return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
    } catch {
      return INITIAL_ATTENDANCE;
    }
  });

  const [homework, setHomework] = useState<Homework[]>(() => {
    try {
      const saved = localStorage.getItem('maktab45_ai_homework_v2');
      return saved ? JSON.parse(saved) : INITIAL_HOMEWORK;
    } catch {
      return INITIAL_HOMEWORK;
    }
  });

  const [submissions, setSubmissions] = useState<StudentSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('maktab45_ai_submissions_v2');
      return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  });

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [role, setRole] = useState<UserRole>('admin');
  const [activeStudent, setActiveStudent] = useState<Student>(() => students[0] || INITIAL_STUDENTS[0]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Modals state
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [selectedStudentForCert, setSelectedStudentForCert] = useState<string>(
    students[0]?.fullName || 'Azizbek Rahimov'
  );

  // Save to LocalStorage on updates
  useEffect(() => {
    try {
      localStorage.setItem('maktab45_ai_students_v2', JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save students to localStorage', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem('maktab45_ai_attendance_v2', JSON.stringify(attendance));
    } catch (e) {
      console.error('Failed to save attendance to localStorage', e);
    }
  }, [attendance]);

  useEffect(() => {
    try {
      localStorage.setItem('maktab45_ai_homework_v2', JSON.stringify(homework));
    } catch (e) {
      console.error('Failed to save homework to localStorage', e);
    }
  }, [homework]);

  useEffect(() => {
    try {
      localStorage.setItem('maktab45_ai_submissions_v2', JSON.stringify(submissions));
    } catch (e) {
      console.error('Failed to save submissions to localStorage', e);
    }
  }, [submissions]);

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
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsLoginModalOpen(true);
  };

  // Handlers for Students CRUD
  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    if (activeStudent.id === updatedStudent.id) {
      setActiveStudent(updatedStudent);
    }
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    if (activeStudent.id === studentId && students.length > 1) {
      setActiveStudent(students.find((s) => s.id !== studentId) || students[0]);
    }
  };

  // Handlers for Attendance
  const handleUpdateAttendance = (newAttendance: AttendanceRecord[]) => {
    setAttendance(newAttendance);
  };

  // Handlers for Homework & Submissions
  const handleAddHomework = (newHw: Homework) => {
    setHomework((prev) => [...prev, newHw]);
  };

  const handleSubmitHomework = (newSub: StudentSubmission) => {
    setSubmissions((prev) => {
      const filtered = prev.filter(
        (s) => !(s.homeworkId === newSub.homeworkId && s.studentId === newSub.studentId)
      );
      return [...filtered, newSub];
    });
  };

  const handleGradeSubmission = (subId: string, score: number, feedback: string) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === subId ? { ...s, score, feedback, status: 'graded' } : s
      )
    );
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
      />

      {/* Main Viewport Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Banner if in Student Mode */}
        {role === 'student' && activeTab !== 'portal' && (
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
            setActiveTab={setActiveTab}
            onOpenAddStudent={() => setIsAddStudentModalOpen(true)}
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
            onAddHomework={handleAddHomework}
            onSubmitHomework={handleSubmitHomework}
            onGradeSubmission={handleGradeSubmission}
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
            onOpenCertificateForMe={() => {
              setSelectedStudentForCert(activeStudent.fullName);
              setActiveTab('certificate');
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

      {/* Login Modal */}
      <LoginModal
        students={students}
        isOpen={isLoginModalOpen || !isAuthenticated}
        onLoginSuccess={handleLoginSuccess}
        onClose={() => setIsLoginModalOpen(false)}
        allowClose={isAuthenticated}
      />

      {/* Cyber OS Minimal Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-[#04060f]/90 py-5 text-center text-xs text-slate-500 font-mono-code">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>45-SONLI MAKTAB · USTOZ M.XO'JAYEV SUN'IY INTELLEKT KURSI (72 SOAT)</div>
          <div>CYBER OS v2.8 · YAGONA KIRISH VA OYLIK TO'LOV NAZORATI</div>
        </div>
      </footer>
    </div>
  );
}
