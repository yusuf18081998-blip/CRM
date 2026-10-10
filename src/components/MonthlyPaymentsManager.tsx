import React, { useState } from 'react';
import { Student, PaymentMonthKey, MONTH_LIST } from '../types';
import { CreditCard, CheckCircle2, AlertTriangle, Award, Calendar, Search, DollarSign, Check, X } from 'lucide-react';

interface MonthlyPaymentsManagerProps {
  students: Student[];
  onUpdateStudent: (updatedStudent: Student) => void;
}

export const MonthlyPaymentsManager: React.FC<MonthlyPaymentsManagerProps> = ({
  students,
  onUpdateStudent,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<PaymentMonthKey>('oktyabr');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const currentMonthObj = MONTH_LIST.find((m) => m.key === selectedMonth) || MONTH_LIST[1];

  // Update payment status for a student in selected month
  const handleSetMonthStatus = (
    student: Student,
    monthKey: PaymentMonthKey,
    status: 'paid' | 'pending' | 'scholarship'
  ) => {
    const updatedPayments = {
      ...student.monthlyPayments,
      [monthKey]: {
        status,
        amount: status === 'scholarship' ? 0 : 100000,
        paidDate: status === 'paid' ? new Date().toISOString().split('T')[0] : undefined,
      },
    };

    const updatedStudent: Student = {
      ...student,
      monthlyPayments: updatedPayments,
    };

    onUpdateStudent(updatedStudent);
  };

  // Calculate statistics for selected month
  let paidCount = 0;
  let pendingCount = 0;
  let scholarshipCount = 0;
  let totalRevenue = 0;

  students.forEach((s) => {
    const payment = s.monthlyPayments?.[selectedMonth];
    if (payment?.status === 'paid') {
      paidCount++;
      totalRevenue += payment.amount || 100000;
    } else if (payment?.status === 'scholarship') {
      scholarshipCount++;
    } else {
      pendingCount++;
    }
  });

  // Filter students
  const filteredStudents = students.filter((s) => {
    const payment = s.monthlyPayments?.[selectedMonth];
    const status = payment?.status || 'pending';

    const matchesSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.grade.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === 'all' || status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cyber-glass p-6 rounded-xl border border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>OYLIK TO'LOVLAR NAZORATI · 45-MAKTAB STEM AI</span>
            <span aria-hidden="true">·</span>
            <span>2026-2027 O'QUV YILI</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Har Oylik To'lovlar Boshqaruvi
          </h1>
          <p className="text-sm text-slate-300">
            Har bir oy bo'yicha o'quvchilarning to'lov holatini (To'langan / Kutilmoqda / Grant) yangilang va monitoring qiling.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-950/40 border border-emerald-500/40 font-mono-code text-xs text-emerald-300">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>Kurs narxi: <strong>100 000 UZS / oy</strong></span>
        </div>
      </div>

      {/* Month Selector Strip */}
      <div className="cyber-glass-card rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-mono-code text-slate-400 uppercase tracking-wider">
            O'quv Oyini Tanlang:
          </span>
          <span className="text-xs font-mono-code text-cyan-400 font-bold">
            Tanlangan: {currentMonthObj.name} 2026-2027
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {MONTH_LIST.map((m) => {
            const isSelected = selectedMonth === m.key;
            // quick calc for this month
            const pCount = students.filter(
              (s) => s.monthlyPayments?.[m.key]?.status === 'paid'
            ).length;

            return (
              <button
                key={m.key}
                onClick={() => setSelectedMonth(m.key)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex flex-col items-start gap-0.5 ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{m.name}</span>
                <span className={`text-[10px] font-mono-code ${isSelected ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}>
                  {pCount}/{students.length} to'ladi
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Month KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cyber-glass-card rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase font-mono-code mb-1">
            {currentMonthObj.name} Tushumi
          </div>
          <div className="text-2xl font-bold font-mono-code text-emerald-400">
            {totalRevenue.toLocaleString()} UZS
          </div>
          <div className="text-xs text-slate-500 mt-0.5 font-mono-code">
            {paidCount} ta o'quvchi to'lovi
          </div>
        </div>

        <div className="cyber-glass-card rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase font-mono-code mb-1">
            To'langan
          </div>
          <div className="text-2xl font-bold font-mono-code text-white">
            {paidCount} <span className="text-sm font-normal text-slate-400">/ {students.length}</span>
          </div>
          <div className="text-xs text-emerald-400 mt-0.5 font-mono-code">
            Qamrov: {students.length > 0 ? Math.round((paidCount / students.length) * 100) : 0}%
          </div>
        </div>

        <div className="cyber-glass-card rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase font-mono-code mb-1">
            Kutilmoqda / Qarz
          </div>
          <div className="text-2xl font-bold font-mono-code text-rose-400">
            {pendingCount} nafar
          </div>
          <div className="text-xs text-slate-500 mt-0.5 font-mono-code">
            To'lov qilinishi kutilayotgan
          </div>
        </div>

        <div className="cyber-glass-card rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase font-mono-code mb-1">
            100% Grantlar
          </div>
          <div className="text-2xl font-bold font-mono-code text-amber-400">
            {scholarshipCount} nafar
          </div>
          <div className="text-xs text-amber-400/80 mt-0.5 font-mono-code">
            Maktab stipendiyasi
          </div>
        </div>
      </div>

      {/* Filter and Student Monthly Payment Table */}
      <div className="cyber-glass rounded-xl overflow-hidden border border-slate-800">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ism, login yoki ID bo'yicha qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700/60 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-code text-slate-400">Holat:</span>
            <select
              aria-label="Holat bo'yicha saralash"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="all">Barchasi</option>
              <option value="paid">To'langan</option>
              <option value="pending">Kutilmoqda (To'lanmagan)</option>
              <option value="scholarship">100% Grant</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono-code border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">O'quvchi</th>
                <th className="py-3 px-3">Sinfi</th>
                <th className="py-3 px-4 text-center">{currentMonthObj.name} Oyi Holati</th>
                <th className="py-3 px-4 text-center">To'lovni Yangilash</th>
                <th className="py-3 px-4 text-center">Yillik 9 Oylik Matritsa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStudents.map((student) => {
                const monthPayment = student.monthlyPayments?.[selectedMonth] || {
                  status: 'pending',
                  amount: 100000,
                };
                const status = monthPayment.status;

                return (
                  <tr key={student.id} className="hover:bg-slate-900/50 transition-colors">
                    {/* Student Info */}
                    <td className="py-3.5 px-4 font-medium whitespace-nowrap">
                      <div className="font-semibold text-slate-100">{student.fullName}</div>
                      <div className="text-[11px] font-mono-code text-cyan-400/80">
                        {student.id} · @{student.username}
                      </div>
                    </td>

                    {/* Grade */}
                    <td className="py-3.5 px-3 text-slate-300 font-mono-code whitespace-nowrap">
                      {student.grade}
                    </td>

                    {/* Current Month Status Badge */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {status === 'paid' ? (
                        <div className="inline-flex flex-col items-center">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30 font-mono-code">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>To'langan (100 000 UZS)</span>
                          </span>
                          {monthPayment.paidDate && (
                            <span className="text-[10px] text-slate-500 font-mono-code mt-0.5">
                              Sana: {monthPayment.paidDate}
                            </span>
                          )}
                        </div>
                      ) : status === 'scholarship' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30 font-mono-code" title={student.scholarshipReason}>
                          <Award className="w-3 h-3" />
                          <span>100% Grant</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded border border-rose-500/30 font-mono-code">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Kutilmoqda (To'lanmagan)</span>
                        </span>
                      )}
                    </td>

                    {/* Quick Update Buttons */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 p-1 rounded-lg bg-slate-950/80 border border-slate-800">
                        <button
                          onClick={() => handleSetMonthStatus(student, selectedMonth, 'paid')}
                          className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                            status === 'paid'
                              ? 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                              : 'text-slate-400 hover:text-emerald-400'
                          }`}
                          title="To'langan deb belgilash"
                        >
                          <Check className="w-3 h-3" />
                          <span>To'landi</span>
                        </button>

                        <button
                          onClick={() => handleSetMonthStatus(student, selectedMonth, 'pending')}
                          className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                            status === 'pending'
                              ? 'bg-rose-500 text-white font-bold shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                              : 'text-slate-400 hover:text-rose-400'
                          }`}
                          title="Kutilmoqda deb belgilash"
                        >
                          <X className="w-3 h-3" />
                          <span>Kutilmoqda</span>
                        </button>

                        <button
                          onClick={() => handleSetMonthStatus(student, selectedMonth, 'scholarship')}
                          className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                            status === 'scholarship'
                              ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                              : 'text-slate-400 hover:text-amber-400'
                          }`}
                          title="100% Grant deb belgilash"
                        >
                          <Award className="w-3 h-3" />
                          <span>Grant</span>
                        </button>
                      </div>
                    </td>

                    {/* Full 9-Month Mini Matrix */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        {MONTH_LIST.map((m) => {
                          const mStat = student.monthlyPayments?.[m.key]?.status || 'pending';
                          return (
                            <div
                              key={m.key}
                              title={`${m.name}: ${mStat === 'paid' ? "To'langan" : mStat === 'scholarship' ? '100% Grant' : 'Kutilmoqda'}`}
                              className={`w-5 h-5 rounded text-[10px] font-mono-code flex items-center justify-center font-bold ${
                                mStat === 'paid'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : mStat === 'scholarship'
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                              }`}
                            >
                              {m.name.charAt(0)}
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <CreditCard className="w-8 h-8 text-cyan-400/40" />
                      <p className="text-sm font-semibold text-slate-300">
                        O'quvchilar ro'yxati bo'sh
                      </p>
                      <p className="text-xs text-slate-500">
                        Oylik to'lovlarni nazorat qilish uchun avval o'quvchilarni kiritishingiz kerak.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
