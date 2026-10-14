import React, { useState } from 'react';
import { Student, AttendanceRecord, StudentSubmission } from '../types';
import { UserPlus, Search, Edit2, Trash2, Award, UserCheck, Phone, Send, CheckCircle2, AlertTriangle, Key, Copy, Check, Eye, EyeOff, Sparkles, RefreshCw, Camera, Upload } from 'lucide-react';
import { generateUniqueUsername, generateUniquePassword } from '../utils/studentCredentials';
import { compressImageFile } from '../utils/imageCompressor';
import { generateSyncUrl, exportDatabaseFile } from '../utils/cloudSync';

interface StudentsManagerProps {
  students: Student[];
  attendance: AttendanceRecord[];
  submissions: StudentSubmission[];
  onAddStudent: (newStudent: Student) => void;
  onUpdateStudent: (updatedStudent: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onSelectStudentForPortal: (student: Student) => void;
  onSelectStudentForCertificate: (student: Student) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

export const StudentsManager: React.FC<StudentsManagerProps> = ({
  students,
  attendance,
  submissions,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onSelectStudentForPortal,
  onSelectStudentForCertificate,
  isAddModalOpen,
  setIsAddModalOpen,
}) => {
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [visiblePasswordId, setVisiblePasswordId] = useState<string | null>(null);
  const [isSyncCopied, setIsSyncCopied] = useState<boolean>(false);

  // Form states for new student
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+998 9');
  const [telegramUsername, setTelegramUsername] = useState('@');
  const [grade, setGrade] = useState('5-A sinf');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending' | 'scholarship'>('paid');
  const [scholarshipReason, setScholarshipReason] = useState('');
  const [notes, setNotes] = useState('');

  // Auto-generate username & password when typing name
  const handleNameChange = (name: string) => {
    setFullName(name);
    if (name.trim().length >= 2) {
      const genUser = generateUniqueUsername(name, students);
      const genPass = generateUniquePassword(name, students);
      setUsername(genUser);
      setPassword(genPass);
    }
  };

  const handleManualRegenerate = () => {
    const genUser = generateUniqueUsername(fullName.trim() || `talaba_${students.length + 1}`, students);
    const genPass = generateUniquePassword(fullName.trim() || `talaba_${students.length + 1}`, students);
    setUsername(genUser);
    setPassword(genPass);
  };

  const isUsernameDuplicate = students.some(
    (s) => s.username.toLowerCase() === username.trim().toLowerCase()
  );
  const isPasswordDuplicate = students.some((s) => s.password === password.trim());

  // Handle Create Student
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim() || !password.trim()) return;
    if (isUsernameDuplicate) return;

    // Oylik to'lov summasi: 100 000 so'm
    const initialMonthly: Student['monthlyPayments'] = {
      sentyabr: { status: paymentStatus === 'scholarship' ? 'scholarship' : 'paid', paidDate: new Date().toISOString().split('T')[0], amount: paymentStatus === 'scholarship' ? 0 : 100000 },
      oktyabr: { status: paymentStatus === 'scholarship' ? 'scholarship' : paymentStatus === 'pending' ? 'pending' : 'paid', amount: paymentStatus === 'scholarship' ? 0 : 100000 },
      noyabr: { status: paymentStatus === 'scholarship' ? 'scholarship' : 'pending', amount: paymentStatus === 'scholarship' ? 0 : 100000 },
      dekabr: { status: paymentStatus === 'scholarship' ? 'scholarship' : 'pending', amount: paymentStatus === 'scholarship' ? 0 : 100000 },
      yanvar: { status: paymentStatus === 'scholarship' ? 'scholarship' : 'pending', amount: paymentStatus === 'scholarship' ? 0 : 100000 },
      fevral: { status: paymentStatus === 'scholarship' ? 'scholarship' : 'pending', amount: paymentStatus === 'scholarship' ? 0 : 100000 },
      mart: { status: paymentStatus === 'scholarship' ? 'scholarship' : 'pending', amount: paymentStatus === 'scholarship' ? 0 : 100000 },
      aprel: { status: paymentStatus === 'scholarship' ? 'scholarship' : 'pending', amount: paymentStatus === 'scholarship' ? 0 : 100000 },
      may: { status: paymentStatus === 'scholarship' ? 'scholarship' : 'pending', amount: paymentStatus === 'scholarship' ? 0 : 100000 },
    };

    const newId = `AI-45-${String(students.length + 1).padStart(2, '0')}`;

    const newStudent: Student = {
      id: newId,
      fullName: fullName.trim(),
      username: username.trim().toLowerCase(),
      password: password.trim(),
      phone: phone.trim(),
      telegramUsername: telegramUsername.trim() || undefined,
      grade,
      enrolledDate: new Date().toISOString().split('T')[0],
      monthlyPayments: initialMonthly,
      scholarshipReason: paymentStatus === 'scholarship' ? scholarshipReason : undefined,
      avatarSeed: fullName.trim().split(' ')[0],
      notes: notes.trim() || undefined,
    };

    onAddStudent(newStudent);
    setIsAddModalOpen(false);
    resetForm();
  };

  // Handle Edit Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    onUpdateStudent(editingStudent);
    setEditingStudent(null);
  };

  const resetForm = () => {
    setFullName('');
    setUsername('');
    setPassword('');
    setPhone('+998 9');
    setTelegramUsername('@');
    setGrade('5-A sinf');
    setPaymentStatus('paid');
    setScholarshipReason('');
    setNotes('');
  };

  const copyCredentials = (student: Student) => {
    const text = `45-MAKTAB SUN'IY INTELLEKT KURSI KABINETI:\nIsm: ${student.fullName}\nLogin: ${student.username}\nParol: ${student.password}\nKirish manzili: 45-Maktab AI OS`;
    navigator.clipboard.writeText(text);
    setCopiedId(student.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Calculate student performance stats
  const getStudentStats = (studentId: string) => {
    let present = 0;
    attendance.forEach((att) => {
      if (att.records[studentId] === 'present') present++;
    });
    const attPct = attendance.length > 0 ? Math.round((present / attendance.length) * 100) : 100;

    const stSubs = submissions.filter((sub) => sub.studentId === studentId && sub.score !== undefined);
    const avgScore = stSubs.length > 0
      ? Math.round(stSubs.reduce((acc, curr) => acc + (curr.score || 0), 0) / stSubs.length)
      : 88;

    return { attPct, avgScore, subsCount: stSubs.length };
  };

  // Filtered list
  const filtered = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.username.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search);
    const matchesGrade = gradeFilter === 'all' || s.grade.includes(gradeFilter);
    const curPay = s.monthlyPayments?.['oktyabr']?.status || (s.scholarshipReason ? 'scholarship' : 'pending');
    const matchesPayment = paymentFilter === 'all' || curPay === paymentFilter;

    return matchesSearch && matchesGrade && matchesPayment;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner and Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cyber-glass p-6 rounded-xl border border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>O'QUVCHILAR BAZASI VA LOGIN-PAROL BOSHQARUVI</span>
            <span aria-hidden="true">·</span>
            <span>JAMI {students.length} NAFAR O'QUVCHI</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Talabalar va Kirish Kalitlari (CRUD)
          </h1>
          <p className="text-sm text-slate-300">
            Har bir o'quvchiga shaxsiy login va parol biriktirish, parollarni yangilash, tahrirlash va ulashish.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Telegram / Telefonlarga sinxronlash havolasi */}
          <button
            type="button"
            onClick={() => {
              const url = generateSyncUrl(students);
              navigator.clipboard.writeText(url);
              setIsSyncCopied(true);
              setTimeout(() => setIsSyncCopied(false), 3000);
            }}
            className="px-3.5 py-2.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 border border-emerald-400 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer shrink-0"
            title="Ushbu havolani Telegram guruhga yoki o'quvchilar telefoniga yuboring: barcha o'quvchilar va ularning loginlari telefonida avtomatik ochiladi"
          >
            {isSyncCopied ? <Check className="w-4 h-4 text-emerald-200" /> : <Send className="w-4 h-4 text-emerald-200" />}
            <span>{isSyncCopied ? "Havola Nusxalandi! ✅" : "O'quvchilarga Havola (Sinxronlash) 📲"}</span>
          </button>

          {/* Baza zaxira nusxasi (Backup) */}
          <button
            type="button"
            onClick={() => {
              exportDatabaseFile(students, attendance, [], submissions);
            }}
            className="px-3 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            title="Barcha o'quvchilar va davomat bazasini fayl sifatida yuklab olish"
          >
            <Upload className="w-3.5 h-3.5 rotate-180 text-cyan-400" />
            <span>Bazani Yuklab Olish</span>
          </button>

          <button
            onClick={() => {
              resetForm();
              setPassword(`ai45_${Math.floor(1000 + Math.random() * 9000)}`);
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.35)] cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Yangi O'quvchi & Login Qo'shish</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="cyber-glass-card rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Ism, login, ID yoki telefon bo'yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700/60 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono-code">
            <span>Sinf:</span>
            <select
              aria-label="Sinf bo'yicha saralash"
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="all">Barcha sinflar (5-11)</option>
              <option value="5">5-sinflar</option>
              <option value="6">6-sinflar</option>
              <option value="7">7-sinflar</option>
              <option value="8">8-sinflar</option>
              <option value="9">9-sinflar</option>
              <option value="10">10-sinflar</option>
              <option value="11">11-sinflar</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono-code">
            <span>To'lov:</span>
            <select
              aria-label="To'lov holati bo'yicha saralash"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="all">Barcha holatlar</option>
              <option value="paid">To'langan</option>
              <option value="scholarship">Grant / Stipendiya</option>
              <option value="pending">Kutilmoqda</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="cyber-glass rounded-xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono-code border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">ID & O'quvchi</th>
                <th className="py-3 px-3">Kirish Logini & Paroli</th>
                <th className="py-3 px-3">Sinfi</th>
                <th className="py-3 px-3">To'lov Holati</th>
                <th className="py-3 px-3 text-center">Davomat</th>
                <th className="py-3 px-3 text-center">Ball</th>
                <th className="py-3 px-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((student) => {
                const stats = getStudentStats(student.id);
                const isPasswordVisible = visiblePasswordId === student.id;

                return (
                  <tr key={student.id} className="hover:bg-slate-900/50 transition-colors">
                    {/* ID & Name */}
                    <td className="py-3.5 px-4 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center font-mono-code font-bold text-cyan-300 text-xs overflow-hidden shrink-0">
                          {student.avatarUrl ? (
                            <img src={student.avatarUrl} alt={student.fullName} className="w-full h-full object-cover" />
                          ) : (
                            student.fullName.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-100">{student.fullName}</div>
                          <div className="text-[11px] font-mono-code text-cyan-400/80">{student.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Login & Password Badges with Copy and Toggle */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 px-2.5 rounded bg-slate-950/80 border border-slate-800 font-mono-code text-[11px] space-y-0.5">
                          <div className="flex items-center gap-1.5 text-cyan-300">
                            <span className="text-slate-500">login:</span>
                            <strong>{student.username}</strong>
                          </div>
                          <div className="flex items-center gap-1.5 text-amber-300">
                            <span className="text-slate-500">parol:</span>
                            <span>{isPasswordVisible ? student.password : '••••••••'}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() =>
                              setVisiblePasswordId(isPasswordVisible ? null : student.id)
                            }
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title={isPasswordVisible ? "Parolni yashirish" : "Parolni ko'rsatish"}
                          >
                            {isPasswordVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>

                          <button
                            onClick={() => copyCredentials(student)}
                            className="p-1 rounded bg-slate-800 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                            title="Login va parolni nusxalash"
                          >
                            {copiedId === student.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Grade */}
                    <td className="py-3.5 px-3 text-slate-300 font-mono-code whitespace-nowrap">
                      {student.grade}
                    </td>

                    {/* Payment */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {student.monthlyPayments?.['oktyabr']?.status === 'paid' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-mono-code">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Oktyabr: To'langan</span>
                        </span>
                      ) : (student.monthlyPayments?.['oktyabr']?.status === 'scholarship' || student.scholarshipReason) ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 font-mono-code" title={student.scholarshipReason}>
                          <Award className="w-3 h-3" />
                          <span>100% Grant</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30 font-mono-code">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Oktyabr: Kutilmoqda</span>
                        </span>
                      )}
                    </td>

                    {/* Attendance */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap font-mono-code">
                      <span className={`font-bold ${
                        stats.attPct >= 90 ? 'text-emerald-400' : stats.attPct >= 75 ? 'text-cyan-400' : 'text-rose-400'
                      }`}>
                        {stats.attPct}%
                      </span>
                    </td>

                    {/* Average Score */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap font-mono-code">
                      <span className="font-bold text-amber-300">
                        {stats.avgScore} ball
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectStudentForPortal(student)}
                          className="p-1.5 rounded bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
                          title="Shaxsiy kabinetga kirish"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSelectStudentForCertificate(student)}
                          className="p-1.5 rounded bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
                          title="Sertifikat berish"
                        >
                          <Award className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingStudent(student)}
                          className="p-1.5 rounded bg-slate-800 hover:bg-blue-500/20 text-slate-300 hover:text-blue-300 transition-colors cursor-pointer"
                          title="Tahrirlash va parolni o'zgartirish"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`${student.fullName} bazadan o'chirilsinmi?`)) {
                              onDeleteStudent(student.id);
                            }
                          }}
                          className="p-1.5 rounded bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors cursor-pointer"
                          title="O'chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                        <UserPlus className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-slate-200">
                        Hozircha o'quvchilar ro'yxati bo'sh
                      </p>
                      <p className="text-xs text-slate-500 max-w-sm">
                        Baza toza. O'quvchilarni o'zingiz kiritishingiz uchun yuqoridagi <strong>"Yangi O'quvchi & Login Qo'shish"</strong> tugmasini bosing.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="cyber-glass rounded-xl p-6 max-w-lg w-full border border-cyan-500/40 shadow-2xl my-auto">
            <h3 className="text-lg font-bold text-white mb-4 pb-3 border-b border-slate-800 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-cyan-400" />
              <span>Yangi O'quvchi & Login-Parol Yaratish</span>
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  Ism va Familiya
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Sardor Bobomurodov"
                  value={fullName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              {/* Login and Password Fields */}
              <div className="p-3.5 rounded-lg bg-cyan-950/30 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono-code text-cyan-300 flex items-center gap-1.5 font-bold">
                    <Key className="w-3.5 h-3.5 text-cyan-400" />
                    <span>O'QUVCHINING SHAXSIY KIRISH KALITLARI (AVTO-GENERATSIYA)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleManualRegenerate}
                    className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-mono-code flex items-center gap-1 transition-all cursor-pointer"
                    title="Ism-familiyasiga qarab yangi takrorlanmas login va parol generatsiya qilish"
                  >
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>Qayta Generatsiya</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono-code text-slate-300 mb-1">
                      Login (Username)
                    </label>
                    <input
                      type="text"
                      placeholder="masalan: ali_valiyev"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                      className={`w-full bg-slate-900 border rounded-lg px-3 py-2 text-xs font-mono-code focus:outline-none ${
                        isUsernameDuplicate
                          ? 'border-rose-500 text-rose-300 focus:border-rose-400'
                          : 'border-slate-700 text-cyan-200 focus:border-cyan-400'
                      }`}
                      required
                    />
                    {isUsernameDuplicate ? (
                      <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-mono-code">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        <span>Bu login band! Boshqa kiriting yoki 'Qayta Generatsiya'ni bosing.</span>
                      </p>
                    ) : username ? (
                      <p className="text-[10px] text-emerald-400/80 mt-1 font-mono-code">
                        ✓ Unikal login yaratildi
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label className="block text-xs font-mono-code text-slate-300 mb-1">
                      Maxfiy Parol
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        placeholder="masalan: ali2013"
                        value={password}
                        onChange={(e) => setPassword(e.target.value.trim())}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-amber-200 font-mono-code focus:outline-none focus:border-cyan-400"
                        required
                      />
                      <button
                        type="button"
                        onClick={handleManualRegenerate}
                        className="px-2 py-2 bg-slate-800 hover:bg-slate-700 text-[10px] text-cyan-300 rounded font-mono-code whitespace-nowrap cursor-pointer"
                        title="Ism-familiyasiga mos unikal parol"
                      >
                        Avto
                      </button>
                    </div>
                    {password && (
                      <p className="text-[10px] text-amber-400/80 mt-1 font-mono-code">
                        ✓ Parol: {password}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">
                    Telefon Raqami
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">
                    Telegram Username
                  </label>
                  <input
                    type="text"
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">
                    Maktab Sinfi
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="5-A sinf">5-A sinf</option>
                    <option value="5-B sinf">5-B sinf</option>
                    <option value="5-V sinf">5-V sinf</option>
                    <option value="6-A sinf">6-A sinf</option>
                    <option value="6-B sinf">6-B sinf</option>
                    <option value="6-V sinf">6-V sinf</option>
                    <option value="7-A sinf">7-A sinf</option>
                    <option value="7-B sinf">7-B sinf</option>
                    <option value="7-V sinf">7-V sinf</option>
                    <option value="8-A sinf">8-A sinf</option>
                    <option value="8-B sinf">8-B sinf</option>
                    <option value="8-V sinf">8-V sinf</option>
                    <option value="9-A sinf">9-A sinf</option>
                    <option value="9-B sinf">9-B sinf</option>
                    <option value="9-V sinf">9-V sinf</option>
                    <option value="10-A sinf">10-A sinf</option>
                    <option value="10-B sinf">10-B sinf</option>
                    <option value="10-V sinf">10-V sinf</option>
                    <option value="11-A sinf">11-A sinf</option>
                    <option value="11-B sinf">11-B sinf</option>
                    <option value="11-V sinf">11-V sinf</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">
                    To'lov Holati
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="paid">To'langan (100 000 so'm / oy)</option>
                    <option value="scholarship">100% Grant (Maktab imtiyozi)</option>
                    <option value="pending">Kutilmoqda / Kechiktirilgan</option>
                  </select>
                </div>
              </div>

              {paymentStatus === 'scholarship' && (
                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">
                    Grant Berilish Sababi
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: Informatika fan olimpiadasi g'olibi"
                    value={scholarshipReason}
                    onChange={(e) => setScholarshipReason(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  Qo'shimcha Izoh
                </label>
                <textarea
                  placeholder="O'quvchining kompyuter bilimlari, qiziqishlari..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                >
                  Bekor Qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.4)] cursor-pointer"
                >
                  Bazaga Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="cyber-glass rounded-xl p-6 max-w-lg w-full border border-blue-500/40 shadow-2xl my-auto">
            <h3 className="text-lg font-bold text-white mb-4 pb-3 border-b border-slate-800 flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-blue-400" />
              <span>O'quvchi va Login-Parolni Tahrirlash: {editingStudent.id}</span>
            </h3>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  Ism va Familiya
                </label>
                <input
                  type="text"
                  value={editingStudent.fullName}
                  onChange={(e) => setEditingStudent({ ...editingStudent, fullName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              {/* Profil Rasmi (Avatar) */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="w-14 h-14 rounded-xl bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300 font-orbitron font-bold text-lg overflow-hidden shrink-0">
                  {editingStudent.avatarUrl ? (
                    <img src={editingStudent.avatarUrl} alt={editingStudent.fullName} className="w-full h-full object-cover" />
                  ) : (
                    editingStudent.fullName.charAt(0)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-200 mb-1">Profil Rasmi</div>
                  <div className="flex items-center gap-2">
                    <label className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold cursor-pointer inline-flex items-center gap-1 transition-colors">
                      <Camera className="w-3 h-3" />
                      <span>Rasm yuklash</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const compressed = await compressImageFile(file);
                              setEditingStudent({ ...editingStudent, avatarUrl: compressed });
                            } catch {
                              // ignore
                            }
                          }
                        }}
                      />
                    </label>
                    {editingStudent.avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setEditingStudent({ ...editingStudent, avatarUrl: undefined })}
                        className="px-2 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs cursor-pointer"
                      >
                        O'chirish
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Edit Login and Password */}
              <div className="p-3.5 rounded-lg bg-blue-950/30 border border-blue-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono-code text-blue-300 flex items-center gap-1.5 font-bold">
                    <Key className="w-3.5 h-3.5 text-blue-400" />
                    <span>KIRISH LOGINI VA PAROLINI YANGILASH</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newGenUser = generateUniqueUsername(editingStudent.fullName, students, editingStudent.id);
                      const newGenPass = generateUniquePassword(editingStudent.fullName, students, editingStudent.id);
                      setEditingStudent({
                        ...editingStudent,
                        username: newGenUser,
                        password: newGenPass,
                      });
                    }}
                    className="px-2.5 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 text-[11px] font-mono-code flex items-center gap-1 transition-all cursor-pointer"
                    title="Ism-familiyasiga mos unikal login va parol generatsiya qilish"
                  >
                    <Sparkles className="w-3 h-3 text-blue-400" />
                    <span>Avto-Generatsiya</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono-code text-slate-300 mb-1">
                      Login (Username)
                    </label>
                    <input
                      type="text"
                      value={editingStudent.username}
                      onChange={(e) => setEditingStudent({ ...editingStudent, username: e.target.value.toLowerCase().trim() })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-cyan-200 font-mono-code focus:outline-none focus:border-cyan-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-code text-slate-300 mb-1">
                      Maxfiy Parol
                    </label>
                    <input
                      type="text"
                      value={editingStudent.password}
                      onChange={(e) => setEditingStudent({ ...editingStudent, password: e.target.value.trim() })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-amber-200 font-mono-code focus:outline-none focus:border-cyan-400"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">
                    Telefon Raqami
                  </label>
                  <input
                    type="text"
                    value={editingStudent.phone}
                    onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">
                    Telegram Username
                  </label>
                  <input
                    type="text"
                    value={editingStudent.telegramUsername || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, telegramUsername: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">
                    Maktab Sinfi
                  </label>
                  <input
                    type="text"
                    list="edit-grade-options"
                    value={editingStudent.grade}
                    onChange={(e) => setEditingStudent({ ...editingStudent, grade: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                  <datalist id="edit-grade-options">
                    <option value="5-A sinf" />
                    <option value="5-B sinf" />
                    <option value="5-V sinf" />
                    <option value="6-A sinf" />
                    <option value="6-B sinf" />
                    <option value="6-V sinf" />
                    <option value="7-A sinf" />
                    <option value="7-B sinf" />
                    <option value="7-V sinf" />
                    <option value="8-A sinf" />
                    <option value="8-B sinf" />
                    <option value="8-V sinf" />
                    <option value="9-A sinf" />
                    <option value="9-B sinf" />
                    <option value="9-V sinf" />
                    <option value="10-A sinf" />
                    <option value="10-B sinf" />
                    <option value="10-V sinf" />
                    <option value="11-A sinf" />
                    <option value="11-B sinf" />
                    <option value="11-V sinf" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">
                    Oktyabr Oyi To'lov Holati
                  </label>
                  <select
                    value={editingStudent.monthlyPayments?.['oktyabr']?.status || (editingStudent.scholarshipReason ? 'scholarship' : 'pending')}
                    onChange={(e) => {
                      const newStat = e.target.value as any;
                      const updatedMonthly = {
                        ...editingStudent.monthlyPayments,
                        oktyabr: {
                          status: newStat,
                          amount: newStat === 'scholarship' ? 0 : 100000,
                          paidDate: newStat === 'paid' ? (editingStudent.monthlyPayments?.['oktyabr']?.paidDate || new Date().toISOString().split('T')[0]) : undefined
                        }
                      };
                      setEditingStudent({
                        ...editingStudent,
                        monthlyPayments: updatedMonthly,
                        scholarshipReason: newStat === 'scholarship' ? (editingStudent.scholarshipReason || 'Maktab granti') : undefined
                      });
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="paid">To'langan (100 000 so'm / oy)</option>
                    <option value="scholarship">100% Grant</option>
                    <option value="pending">Kutilmoqda (To'lanmagan)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  Izohlar
                </label>
                <textarea
                  value={editingStudent.notes || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, notes: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                >
                  Bekor Qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(59,130,246,0.4)] cursor-pointer"
                >
                  Yangilanishlarni Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
