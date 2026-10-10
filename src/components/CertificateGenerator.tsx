import React, { useState, useRef } from 'react';
import { Student } from '../types';
import confetti from 'canvas-confetti';
import { Award, Download, Printer, Sparkles, CheckCircle2, Shield, QrCode, Cpu } from 'lucide-react';

interface CertificateGeneratorProps {
  students: Student[];
  initialStudentName?: string;
}

export const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({
  students,
  initialStudentName = '',
}) => {
  const [studentName, setStudentName] = useState(initialStudentName || (students[0]?.fullName ?? ''));
  const [courseTitle, setCourseTitle] = useState("Sun'iy Intellekt va Machine Learning");
  const [completionGrade, setCompletionGrade] = useState("A'lo Darajali (A+)");
  const [issueDate, setIssueDate] = useState('2026-10-10');
  const [instructorName, setInstructorName] = useState("Ustoz M.Xo'jayev (Senior AI Lead)");
  const [certificateId, setCertificateId] = useState('CERT-AI-2026-45M-001');

  const certificateRef = useRef<HTMLDivElement>(null);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#3b82f6', '#fbbf24', '#10b981'],
    });
  };

  const handlePrint = () => {
    triggerConfetti();
    window.print();
  };

  const handleDownloadImage = () => {
    triggerConfetti();
    const certElement = certificateRef.current;
    if (!certElement) return;

    // Use SVG foreignObject or trigger print
    window.print();
  };

  const selectStudent = (st: Student) => {
    setStudentName(st.fullName);
    setCertificateId(`CERT-AI-2026-45M-${st.id.replace('AI-45-', '0')}`);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="cyber-glass rounded-xl p-6 border border-cyan-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>REAL-TIME SERTIFIKAT GENERATORI</span>
            <span aria-hidden="true">·</span>
            <span>45-MAKTAB STEM AKADEMIYASI</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Sun'iy Intellekt Bitiruv Sertifikati
          </h1>
          <p className="text-sm text-slate-300">
            Ism yozilishi bilan sertifikatda darhol aks etadi va yuqori sifatli PDF formatida saqlab olinadi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(251,191,36,0.35)] transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>PDF / Chop Etish</span>
          </button>
        </div>
      </div>

      {/* Editor & Preview Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Customization Form */}
        <div className="space-y-4 cyber-glass-card rounded-xl p-5 border border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono-code flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Sertifikat Parametrlari</span>
          </h3>

          <div>
            <label className="block text-xs font-mono-code text-slate-300 mb-1">
              O'quvchilar ro'yxatidan tezkor tanlash:
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 bg-slate-900/60 rounded border border-slate-800">
              {students.length === 0 ? (
                <span className="text-[11px] text-slate-500 p-1">
                  Hozircha o'quvchilar kiritilmagan. Quyidagi maydonga ismni erkin yozishingiz mumkin.
                </span>
              ) : (
                students.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => selectStudent(st)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                      studentName === st.fullName
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {st.fullName}
                  </button>
                ))
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-code text-slate-300 mb-1">
              O'quvchi Ism-Sharifi (Jonli yozish)
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Masalan: Sardor Bobomurodov"
              className="w-full bg-slate-900 border border-cyan-500/40 rounded-lg px-3 py-2 text-sm text-cyan-200 font-semibold focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono-code text-slate-300 mb-1">
              Kurs Nomi
            </label>
            <input
              type="text"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono-code text-slate-300 mb-1">
                Baholash Darajasi
              </label>
              <select
                value={completionGrade}
                onChange={(e) => setCompletionGrade(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="A'lo Darajali (A+)">A'lo Darajali (A+)</option>
                <option value="Muvaffaqiyatli (A)">Muvaffaqiyatli (A)</option>
                <option value="Yaxshi (B+)">Yaxshi (B+)</option>
                <option value="Faxriy Diplom">Faxriy Diplom</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono-code text-slate-300 mb-1">
                Berilgan Sana
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-code text-slate-300 mb-1">
              Sertifikat Seriya Raqami
            </label>
            <input
              type="text"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono-code focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono-code text-slate-300 mb-1">
              Kurs Rahbari / Ustoz
            </label>
            <input
              type="text"
              value={instructorName}
              onChange={(e) => setInstructorName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={handlePrint}
              className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              <Download className="w-4 h-4" />
              <span>Sertifikatni PDF qilib Saqlash</span>
            </button>
          </div>
        </div>

        {/* Right: Live Certificate Preview Canvas (A4 Landscape aspect) */}
        <div className="lg:col-span-2 flex flex-col items-center justify-start">
          <div
            id="certificate-print-area"
            ref={certificateRef}
            className="w-full max-w-[760px] aspect-[1.414/1] bg-[#070b1a] text-slate-100 rounded-2xl p-6 sm:p-10 border-4 border-amber-500/40 relative overflow-hidden shadow-2xl flex flex-col justify-between"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, #0d1533 0%, #050816 100%)',
            }}
          >
            {/* Cyber Decorative Corners & Border */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-400" />
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-400" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-400" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-400" />

            {/* Glowing Cyber Accent Background circles */}
            <div className="absolute -top-16 -left-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header: Organization & Crest */}
            <div className="relative z-10 flex items-center justify-between border-b border-amber-500/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[11px] font-mono-code uppercase tracking-widest text-amber-400">
                    O'ZBEKISTON RESPUBLIKASI MAKTABGACHA VA MAKTAB TA'LIMI VAZIRLIGI
                  </div>
                  <div className="font-orbitron font-extrabold text-base tracking-wider text-white">
                    45-SONLI MAKTAB SUN'IY INTELLEKT AKADEMIYASI
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-mono-code text-slate-400">SERIYA RAQAMI:</div>
                <div className="text-xs font-mono-code text-cyan-400 font-bold tracking-wider">
                  {certificateId}
                </div>
              </div>
            </div>

            {/* Main Certificate Title & Recipient */}
            <div className="relative z-10 my-auto text-center space-y-3 py-4">
              <div className="font-orbitron text-xs sm:text-sm uppercase tracking-[0.3em] text-amber-400/90 font-semibold">
                BITIRUV SERTIFIKATI · CERTIFICATE OF EXCELLENCE
              </div>

              <div className="text-xs text-slate-300 italic">
                Ushbu rasmiy sertifikat quyidagi iqtidorli o'quvchiga beriladi:
              </div>

              <div className="py-2">
                <span className="font-orbitron text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-amber-300 drop-shadow-[0_2px_15px_rgba(6,182,212,0.4)] tracking-wide">
                  {studentName || "O'quvchi Ism-Sharifi"}
                </span>
                <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-2" />
              </div>

              <div className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                45-maktab qoshidagi <strong className="text-white font-semibold">{courseTitle}</strong> ixtisoslashtirilgan o'quv dasturini to'liq tamomladi hamda barcha amaliy laboratoriya ishlarini <strong className="text-amber-400 font-bold">{completionGrade}</strong> natija bilan himoya qildi.
              </div>
            </div>

            {/* Footer: Signatures, Seal & QR Verification */}
            <div className="relative z-10 flex items-end justify-between border-t border-amber-500/20 pt-4 text-xs">
              
              {/* Instructor signature */}
              <div className="space-y-1">
                <div className="font-mono-code text-cyan-300 font-bold text-xs">
                  {instructorName}
                </div>
                <div className="text-[10px] text-slate-400 font-mono-code">
                  AI Muhandis & Kurs Rahbari
                </div>
                <div className="text-[10px] text-slate-500 font-mono-code">
                  Sana: {issueDate}
                </div>
              </div>

              {/* Gold Holographic Seal Stamp */}
              <div className="w-20 h-20 rounded-full border-2 border-amber-400/60 bg-amber-500/10 flex flex-col items-center justify-center p-1 text-center shadow-[0_0_20px_rgba(251,191,36,0.25)]">
                <Award className="w-6 h-6 text-amber-400 mb-0.5" />
                <span className="text-[8px] font-mono-code font-bold uppercase text-amber-300 leading-tight">
                  VERIFIED<br />45-AI LAB
                </span>
              </div>

              {/* QR Code and School Admin */}
              <div className="text-right space-y-1">
                <div className="flex items-center justify-end gap-1.5 text-cyan-400 font-mono-code text-[11px]">
                  <QrCode className="w-4 h-4" />
                  <span>ID: 45M-AI-VERIFIED</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono-code">
                  45-maktab Direktori Kengashi
                </div>
                <div className="text-[9px] text-emerald-400 font-mono-code flex items-center justify-end gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Rasmiy Tasdiqlangan</span>
                </div>
              </div>

            </div>
          </div>

          <div className="text-center text-xs text-slate-400 mt-3 font-mono-code">
            * PDF orqali saqlash uchun "PDF / Chop Etish" tugmasini bosing va "Save as PDF" rejimini tanlang.
          </div>
        </div>

      </div>
    </div>
  );
};
