export type AttendanceStatus = 'present' | 'absent' | 'excused';

export type PaymentMonthKey =
  | 'sentyabr'
  | 'oktyabr'
  | 'noyabr'
  | 'dekabr'
  | 'yanvar'
  | 'fevral'
  | 'mart'
  | 'aprel'
  | 'may';

export interface MonthlyPaymentRecord {
  month: PaymentMonthKey;
  monthName: string; // "Sentyabr", "Oktyabr", etc.
  status: 'paid' | 'pending' | 'scholarship';
  paidDate?: string;
  amount: number;
}

export interface Student {
  id: string;
  fullName: string;
  username: string; // Login
  password: string; // Parol
  phone: string;
  telegramUsername?: string;
  grade: string; // e.g. "9-A", "10-B"
  enrolledDate: string;
  monthlyPayments: Record<PaymentMonthKey, { status: 'paid' | 'pending' | 'scholarship'; paidDate?: string; amount: number }>;
  scholarshipReason?: string;
  avatarSeed: string;
  avatarUrl?: string; // Shaxsiy yuklangan profil rasmi (Base64 yoki URL)
  notes?: string;
}

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  lessonNumber: number;
  lessonTopic: string;
  records: Record<string, AttendanceStatus>; // studentId -> status
  notes?: Record<string, string>; // studentId -> izoh / sabab (masalan: "Betob", "Olimpiadada")
  quarter?: number;
}

export interface Homework {
  id: string;
  lessonNumber: number;
  title: string;
  moduleName: string;
  description: string;
  dueDate: string;
  maxScore: number;
  difficulty: 'Oson' | "O'rta" | 'Murakkab';
  starterCodeOrLink?: string;
}

export interface StudentSubmission {
  id: string;
  homeworkId: string;
  studentId: string;
  submittedAt: string;
  content: string; // github or text
  score?: number;
  feedback?: string;
  status: 'pending' | 'graded';
}

export interface CurriculumLesson {
  number: number;
  week: number;
  dayOfWeek: 'Dushanba' | 'Chorshanba';
  topic: string;
  quarter: 1 | 2 | 3 | 4;
  isExam?: boolean;
}

export type ActiveTab = 'overview' | 'attendance' | 'students' | 'payments' | 'schedule' | 'certificate' | 'portal';

export type UserRole = 'admin' | 'student';

export interface AuthState {
  isAuthenticated: boolean;
  role: UserRole;
  studentId?: string;
}

export const MONTH_LIST: { key: PaymentMonthKey; name: string }[] = [
  { key: 'sentyabr', name: 'Sentyabr' },
  { key: 'oktyabr', name: 'Oktyabr' },
  { key: 'noyabr', name: 'Noyabr' },
  { key: 'dekabr', name: 'Dekabr' },
  { key: 'yanvar', name: 'Yanvar' },
  { key: 'fevral', name: 'Fevral' },
  { key: 'mart', name: 'Mart' },
  { key: 'aprel', name: 'Aprel' },
  { key: 'may', name: 'May' },
];export interface AppToast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'grade' | 'homework';
  title: string;
  message: string;
  timestamp?: string;
  duration?: number;
}
