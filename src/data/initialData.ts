import { Student, AttendanceRecord, Homework, StudentSubmission, CurriculumLesson, PaymentMonthKey } from '../types';

export const TEACHER_CREDENTIALS = {
  name: "M.Xo'jayev",
  roleName: "Ustoz M.Xo'jayev",
  title: "Senior AI Engineer & Kurs Rahbari",
  validUsernames: ['mxojayev', 'ustoz', 'admin'],
  validPasswords: ['xojayev2013', 'maktab45', 'admin45'],
  primaryUsername: 'mxojayev',
  primaryPassword: 'xojayev2013',
};

// Oylik to'lov summasi: 100 000 so'm
export const DEFAULT_MONTHLY_FEE = 100000;

// Hozirgi dars holati: 5-hafta Dushanba (9-dars) o'tilgan
export const DEFAULT_COMPLETED_LESSONS: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const createInitialMonthlyPayments = (isScholarship: boolean = false, pendingMonth?: PaymentMonthKey) => {
  const result: Record<PaymentMonthKey, { status: 'paid' | 'pending' | 'scholarship'; paidDate?: string; amount: number }> = {
    sentyabr: { status: isScholarship ? 'scholarship' : 'paid', paidDate: '2026-09-05', amount: isScholarship ? 0 : DEFAULT_MONTHLY_FEE },
    oktyabr: {
      status: isScholarship ? 'scholarship' : pendingMonth === 'oktyabr' ? 'pending' : 'paid',
      paidDate: pendingMonth === 'oktyabr' ? undefined : '2026-10-02',
      amount: isScholarship ? 0 : DEFAULT_MONTHLY_FEE,
    },
    noyabr: { status: isScholarship ? 'scholarship' : 'pending', amount: isScholarship ? 0 : DEFAULT_MONTHLY_FEE },
    dekabr: { status: isScholarship ? 'scholarship' : 'pending', amount: isScholarship ? 0 : DEFAULT_MONTHLY_FEE },
    yanvar: { status: isScholarship ? 'scholarship' : 'pending', amount: isScholarship ? 0 : DEFAULT_MONTHLY_FEE },
    fevral: { status: isScholarship ? 'scholarship' : 'pending', amount: isScholarship ? 0 : DEFAULT_MONTHLY_FEE },
    mart: { status: isScholarship ? 'scholarship' : 'pending', amount: isScholarship ? 0 : DEFAULT_MONTHLY_FEE },
    aprel: { status: isScholarship ? 'scholarship' : 'pending', amount: isScholarship ? 0 : DEFAULT_MONTHLY_FEE },
    may: { status: isScholarship ? 'scholarship' : 'pending', amount: isScholarship ? 0 : DEFAULT_MONTHLY_FEE },
  };
  return result;
};

// 45-maktab Sun'iy Intellekt Kursi — Rasmiy 72 soatlik dars reja (PDF dasturi)
export const CURRICULUM_72_LESSONS: CurriculumLesson[] = [
  // 1-CHORAK (1 - 18 darslar, 1 - 9 hafta)
  { number: 1, week: 1, dayOfWeek: 'Dushanba', topic: "Sun'iy intellekt nima? AI ning kundalik hayotdagi o'rni", quarter: 1 },
  { number: 2, week: 1, dayOfWeek: 'Chorshanba', topic: "AI turlari: tor AI, generativ AI va kelajak AI tushunchasi", quarter: 1 },
  { number: 3, week: 2, dayOfWeek: 'Dushanba', topic: "ChatGPT bilan xavfsiz va samarali ishlash asoslari", quarter: 1 },
  { number: 4, week: 2, dayOfWeek: 'Chorshanba', topic: "Prompt anatomiyasi: rol, vazifa, kontekst va natija formati", quarter: 1 },
  { number: 5, week: 3, dayOfWeek: 'Dushanba', topic: "Aniq topshiriq berish: noaniq va kuchli promptlar", quarter: 1 },
  { number: 6, week: 3, dayOfWeek: 'Chorshanba', topic: "Kontekst berish va AI javobining sifatini oshirish", quarter: 1 },
  { number: 7, week: 4, dayOfWeek: 'Dushanba', topic: "Promptlarda cheklovlar va talablarni belgilash", quarter: 1 },
  { number: 8, week: 4, dayOfWeek: 'Chorshanba', topic: "Zero-shot va few-shot prompting tushunchalari", quarter: 1 },
  { number: 9, week: 5, dayOfWeek: 'Dushanba', topic: "Chain-of-thought o'rniga bosqichma-bosqich vazifa dizayni", quarter: 1 },
  { number: 10, week: 5, dayOfWeek: 'Chorshanba', topic: "ChatGPTda matnni qayta ishlash va tahrirlash", quarter: 1 },
  { number: 11, week: 6, dayOfWeek: 'Dushanba', topic: "Claude bilan hujjat va uzun matnlar ustida ishlash", quarter: 1 },
  { number: 12, week: 6, dayOfWeek: 'Chorshanba', topic: "Gemini bilan ma'lumot izlash va g'oya ishlab chiqish", quarter: 1 },
  { number: 13, week: 7, dayOfWeek: 'Dushanba', topic: "ChatGPT, Claude va Gemini: vazifaga mos model tanlash", quarter: 1 },
  { number: 14, week: 7, dayOfWeek: 'Chorshanba', topic: "AI javoblarini tekshirish: fakt, taxmin va xatolar", quarter: 1 },
  { number: 15, week: 8, dayOfWeek: 'Dushanba', topic: "AI bilan o'qish: konspekt, test va flashcard yaratish", quarter: 1 },
  { number: 16, week: 8, dayOfWeek: 'Chorshanba', topic: "AI yordamida ijodiy g'oya va hikoya yaratish", quarter: 1 },
  { number: 17, week: 9, dayOfWeek: 'Dushanba', topic: "Prompt Engineering mini-loyihasi: muammodan natijagacha", quarter: 1 },
  { number: 18, week: 9, dayOfWeek: 'Chorshanba', topic: "1-CHORAK AMALIY NAZORAT ISHI", quarter: 1, isExam: true },

  // 2-CHORAK (19 - 34 darslar, 10 - 17 hafta)
  { number: 19, week: 10, dayOfWeek: 'Dushanba', topic: "Generativ dizayn nima? Matnni tasvirga aylantirish", quarter: 2 },
  { number: 20, week: 10, dayOfWeek: 'Chorshanba', topic: "Midjourney asoslari: sahna, uslub va kompozitsiya", quarter: 2 },
  { number: 21, week: 11, dayOfWeek: 'Dushanba', topic: "Midjourneyda uslub va vizual kayfiyatni boshqarish", quarter: 2 },
  { number: 22, week: 11, dayOfWeek: 'Chorshanba', topic: "DALL-E 3 bilan aniq obyekt va sahna yaratish", quarter: 2 },
  { number: 23, week: 12, dayOfWeek: 'Dushanba', topic: "DALL-E 3 da kompozitsiya, rang va yorug'likni boshqarish", quarter: 2 },
  { number: 24, week: 12, dayOfWeek: 'Chorshanba', topic: "Leonardo AI: obraz va konsept-art yaratish", quarter: 2 },
  { number: 25, week: 13, dayOfWeek: 'Dushanba', topic: "AI obrazining izchilligi: bir qahramonni turli sahnalarda tasvirlash", quarter: 2 },
  { number: 26, week: 13, dayOfWeek: 'Chorshanba', topic: "Canva AI: Magic Design va taqdimot dizayni", quarter: 2 },
  { number: 27, week: 14, dayOfWeek: 'Dushanba', topic: "Canva AI yordamida poster va ijtimoiy media dizayni", quarter: 2 },
  { number: 28, week: 14, dayOfWeek: 'Chorshanba', topic: "Inpainting: tasvirning bir qismini AI bilan almashtirish", quarter: 2 },
  { number: 29, week: 15, dayOfWeek: 'Dushanba', topic: "Outpainting: tasvir chegarasini kengaytirish", quarter: 2 },
  { number: 30, week: 15, dayOfWeek: 'Chorshanba', topic: "AI bilan fon yaratish va fonni almashtirish", quarter: 2 },
  { number: 31, week: 16, dayOfWeek: 'Dushanba', topic: "Vizual promptlarda kamera, rakurs va kadr tushunchalari", quarter: 2 },
  { number: 32, week: 16, dayOfWeek: 'Chorshanba', topic: "AI yordamida infografika va ma'lumotni vizuallashtirish", quarter: 2 },
  { number: 33, week: 17, dayOfWeek: 'Dushanba', topic: "Generativ dizaynda mualliflik huquqi va manba ko'rsatish", quarter: 2 },
  { number: 34, week: 17, dayOfWeek: 'Chorshanba', topic: "2-CHORAK AMALIY NAZORAT ISHI", quarter: 2, isExam: true },

  // 3-CHORAK (35 - 54 darslar, 18 - 27 hafta)
  { number: 35, week: 18, dayOfWeek: 'Dushanba', topic: "AI audio texnologiyalari: ovoz, nutq va sintetik audio", quarter: 3 },
  { number: 36, week: 18, dayOfWeek: 'Chorshanba', topic: "ElevenLabs: matndan nutq yaratish asoslari", quarter: 3 },
  { number: 37, week: 19, dayOfWeek: 'Dushanba', topic: "AI ovozida talaffuz, pauza va intonatsiyani boshqarish", quarter: 3 },
  { number: 38, week: 19, dayOfWeek: 'Chorshanba', topic: "Audio ssenariy yozish: kirish, asosiy qism va yakun", quarter: 3 },
  { number: 39, week: 20, dayOfWeek: 'Dushanba', topic: "AI video tushunchasi va video promptlar", quarter: 3 },
  { number: 40, week: 20, dayOfWeek: 'Chorshanba', topic: "Runway asoslari: generativ video imkoniyatlari", quarter: 3 },
  { number: 41, week: 21, dayOfWeek: 'Dushanba', topic: "Runwayda kamera harakati va sahna davomiyligi", quarter: 3 },
  { number: 42, week: 21, dayOfWeek: 'Chorshanba', topic: "HeyGen avatarlari: raqamli boshlovchi tushunchasi", quarter: 3 },
  { number: 43, week: 22, dayOfWeek: 'Dushanba', topic: "HeyGen video ssenariysi va vizual nutq madaniyati", quarter: 3 },
  { number: 44, week: 22, dayOfWeek: 'Chorshanba', topic: "AI video uchun storyboard va kadrlar ketma-ketligi", quarter: 3 },
  { number: 45, week: 23, dayOfWeek: 'Dushanba', topic: "Gamma.app: AI yordamida taqdimot yaratish", quarter: 3 },
  { number: 46, week: 23, dayOfWeek: 'Chorshanba', topic: "Gamma taqdimotini tahrirlash va vizual ierarxiya", quarter: 3 },
  { number: 47, week: 24, dayOfWeek: 'Dushanba', topic: "Excelda AI yordamida jadval va formulalar bilan ishlash", quarter: 3 },
  { number: 48, week: 24, dayOfWeek: 'Chorshanba', topic: "Excel ma'lumotlarini tahlil qilish va diagramma g'oyasi", quarter: 3 },
  { number: 49, week: 25, dayOfWeek: 'Dushanba', topic: "Code AI: kodni tushuntirish va xatoni topish", quarter: 3 },
  { number: 50, week: 25, dayOfWeek: 'Chorshanba', topic: "AI yordamida kichik HTML/CSS sahifa yaratish", quarter: 3 },
  { number: 51, week: 26, dayOfWeek: 'Dushanba', topic: "Avtomatlashtirish tushunchasi: trigger, action va natija", quarter: 3 },
  { number: 52, week: 26, dayOfWeek: 'Chorshanba', topic: "AI yordamida ish jarayonini optimallashtirish", quarter: 3 },
  { number: 53, week: 27, dayOfWeek: 'Dushanba', topic: "Multimedia AI mini-loyihasi: audio + video + slayd", quarter: 3 },
  { number: 54, week: 27, dayOfWeek: 'Chorshanba', topic: "3-CHORAK AMALIY NAZORAT ISHI", quarter: 3, isExam: true },

  // 4-CHORAK (55 - 72 darslar, 28 - 36 hafta)
  { number: 55, week: 28, dayOfWeek: 'Dushanba', topic: "No-code tushunchasi va Telegram bot arxitekturasi", quarter: 4 },
  { number: 56, week: 28, dayOfWeek: 'Chorshanba', topic: "Telegram botning vazifalari va foydalanuvchi menyusi", quarter: 4 },
  { number: 57, week: 29, dayOfWeek: 'Dushanba', topic: "No-code bot platformalarida ish jarayoni", quarter: 4 },
  { number: 58, week: 29, dayOfWeek: 'Chorshanba', topic: "Telegram botda savol-javob ssenariysi", quarter: 4 },
  { number: 59, week: 30, dayOfWeek: 'Dushanba', topic: "Botga AI yordamida FAQ va bilim bazasi g'oyasini berish", quarter: 4 },
  { number: 60, week: 30, dayOfWeek: 'Chorshanba', topic: "AI etikasi: halollik, plagiat va o'quvchi mas'uliyati", quarter: 4 },
  { number: 61, week: 31, dayOfWeek: 'Dushanba', topic: "AI va shaxsiy ma'lumotlar: maxfiylik asoslari", quarter: 4 },
  { number: 62, week: 31, dayOfWeek: 'Chorshanba', topic: "AI xatolari va algoritmik tarafkashlik", quarter: 4 },
  { number: 63, week: 32, dayOfWeek: 'Dushanba', topic: "Deepfake va sintetik media savodxonligi", quarter: 4 },
  { number: 64, week: 32, dayOfWeek: 'Chorshanba', topic: "AI kontentini tekshirish va ishonchli manbalar", quarter: 4 },
  { number: 65, week: 33, dayOfWeek: 'Dushanba', topic: "Yillik amaliy loyiha: muammo va loyiha g'oyasini tanlash", quarter: 4 },
  { number: 66, week: 33, dayOfWeek: 'Chorshanba', topic: "Yillik loyiha: AI vositalari va texnik reja", quarter: 4 },
  { number: 67, week: 34, dayOfWeek: 'Dushanba', topic: "Yillik loyiha: kontent va dizayn prototipi", quarter: 4 },
  { number: 68, week: 34, dayOfWeek: 'Chorshanba', topic: "Yillik loyiha: funksiyalarni ishlab chiqish", quarter: 4 },
  { number: 69, week: 35, dayOfWeek: 'Dushanba', topic: "Yillik loyiha: testlash va xatolarni tuzatish", quarter: 4 },
  { number: 70, week: 35, dayOfWeek: 'Chorshanba', topic: "Yillik loyiha: taqdimot va demo tayyorlash", quarter: 4 },
  { number: 71, week: 36, dayOfWeek: 'Dushanba', topic: "Yillik loyiha: yakuniy tahrir va portfel", quarter: 4 },
  { number: 72, week: 36, dayOfWeek: 'Chorshanba', topic: "4-CHORAK AMALIY NAZORAT ISHI — YILLIK LOYIHA HIMOYASI", quarter: 4, isExam: true },
];

// Standart Namunaviy O'quvchilar Bazasi (Foydalanuvchining haqiqiy o'quvchilari)
export const SAMPLE_DEFAULT_STUDENTS: Student[] = [
  {
    id: 'AI-45-01',
    fullName: "Qodirova Muhayyo",
    username: 'qodirova_muhayyo',
    password: 'muhayyo2013',
    grade: '8-A sinf',
    phone: '+998 90 123 45 67',
    telegramUsername: '@qodirova_muhayyo',
    enrolledDate: '2026-09-02',
    avatarSeed: 'Muhayyo',
    notes: "Sun'iy intellekt kursi o'quvchisi",
    monthlyPayments: createInitialMonthlyPayments(false, 'oktyabr'),
  },
  {
    id: 'AI-45-03',
    fullName: "Abduvaliyev Bunyodjon",
    username: 'abduvaliyev_bunyodjon',
    password: 'bunyod2013',
    grade: '9-B sinf',
    phone: '+998 93 345 67 89',
    telegramUsername: '@abduvaliyev_bunyodjon',
    enrolledDate: '2026-09-02',
    avatarSeed: 'Bunyodjon',
    notes: "Python va AI modellar yo'nalishi",
    monthlyPayments: createInitialMonthlyPayments(true),
  },
  {
    id: 'AI-45-04',
    fullName: "Shukurov Muhammadsolih",
    username: 'shukurov_muhammadsolih',
    password: 'solih2013',
    grade: '10-A sinf',
    phone: '+998 94 567 89 01',
    telegramUsername: '@shukurov_muhammadsolih',
    enrolledDate: '2026-09-02',
    avatarSeed: 'Muhammadsolih',
    notes: "Prompt injiniring va generativ modellar",
    monthlyPayments: createInitialMonthlyPayments(false),
  },
];

// O'QUVCHILAR BAZASI
export const INITIAL_STUDENTS: Student[] = SAMPLE_DEFAULT_STUDENTS;

// DAVOMAT JURNALI (Har bir mavzu uchun alohida ochilgan davomat va kunlik baholash betlari)
export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    date: '2026-09-02',
    lessonNumber: 1,
    lessonTopic: "Sun'iy intellekt nima? AI ning kundalik hayotdagi o'rni",
    quarter: 1,
    records: { 'AI-45-01': 'present', 'AI-45-03': 'present', 'AI-45-04': 'present' },
    grades: { 'AI-45-01': 5, 'AI-45-03': 5, 'AI-45-04': 5 },
    gradeComments: {
      'AI-45-01': "Mavzu bo'yicha juda faol javob berdi",
      'AI-45-03': "AI haqida aniq tushunchaga ega",
      'AI-45-04': "Savollarga to'liq va asosli javob berdi",
    },
  },
  {
    date: '2026-09-07',
    lessonNumber: 2,
    lessonTopic: "AI turlari: tor AI, generativ AI va kelajak AI tushunchasi",
    quarter: 1,
    records: { 'AI-45-01': 'present', 'AI-45-03': 'present', 'AI-45-04': 'present' },
    grades: { 'AI-45-01': 5, 'AI-45-03': 4, 'AI-45-04': 5 },
    gradeComments: {
      'AI-45-01': "Generativ AI misollarini a'lo keltirdi",
      'AI-45-03': "Yaxshi ishtirok etdi",
      'AI-45-04': "Tor AI va Umumiy AI farqini to'g'ri aytdi",
    },
  },
  {
    date: '2026-09-09',
    lessonNumber: 3,
    lessonTopic: "ChatGPT bilan xavfsiz va samarali ishlash asoslari",
    quarter: 1,
    records: { 'AI-45-01': 'present', 'AI-45-03': 'present', 'AI-45-04': 'present' },
    grades: { 'AI-45-01': 5, 'AI-45-03': 5, 'AI-45-04': 5 },
    gradeComments: {
      'AI-45-01': "Xavfsizlik qoidalarini to'liq o'zlashtirgan",
      'AI-45-03': "Promptlarni xavfsiz yozishni o'rgandi",
      'AI-45-04': "Amaliy mashg'ulotda eng birinchi bajardi",
    },
  },
  {
    date: '2026-09-14',
    lessonNumber: 4,
    lessonTopic: "Prompt anatomiyasi: rol, vazifa, kontekst va natija formati",
    quarter: 1,
    records: { 'AI-45-01': 'present', 'AI-45-03': 'present', 'AI-45-04': 'present' },
    grades: { 'AI-45-01': 5, 'AI-45-03': 5, 'AI-45-04': 4 },
    gradeComments: {
      'AI-45-01': "Prompt anatomiyasi 4 ta elementini mukammal tushungan",
      'AI-45-03': "Kontekst berishda a'lo mahorat",
      'AI-45-04': "Natija formatini to'g'ri tanladi",
    },
  },
  {
    date: '2026-09-16',
    lessonNumber: 5,
    lessonTopic: "Aniq topshiriq berish: noaniq va kuchli promptlar",
    quarter: 1,
    records: { 'AI-45-01': 'present', 'AI-45-03': 'excused', 'AI-45-04': 'present' },
    grades: { 'AI-45-01': 5, 'AI-45-04': 5 },
    notes: { 'AI-45-03': "Informatika olimpiadasida qatnashgani sababli" },
    gradeComments: {
      'AI-45-01': "Noaniq promptlarni mohirona tahrirladi",
      'AI-45-04': "Kuchli prompt misollari tuzdi",
    },
  },
  {
    date: '2026-09-21',
    lessonNumber: 6,
    lessonTopic: "Kontekst berish va AI javobining sifatini oshirish",
    quarter: 1,
    records: { 'AI-45-01': 'present', 'AI-45-03': 'present', 'AI-45-04': 'present' },
    grades: { 'AI-45-01': 5, 'AI-45-03': 5, 'AI-45-04': 5 },
    gradeComments: {
      'AI-45-01': "AI sifatini oshirish bo'yicha namunali ish",
      'AI-45-03': "Olimpiadadan so'ng darsga a'lo tayyorgarlik bilan qaytdi",
      'AI-45-04': "A'lo darajada faollik",
    },
  },
  {
    date: '2026-09-23',
    lessonNumber: 7,
    lessonTopic: "Promptlarda cheklovlar va talablarni belgilash",
    quarter: 1,
    records: { 'AI-45-01': 'present', 'AI-45-03': 'present', 'AI-45-04': 'present' },
    grades: { 'AI-45-01': 5, 'AI-45-03': 4, 'AI-45-04': 5 },
    gradeComments: {
      'AI-45-01': "Cheklovlar kiritishni to'liq bajardi",
      'AI-45-03': "Yaxshi javob berdi",
      'AI-45-04': "Promptda talablar jadvalini tuzdi",
    },
  },
  {
    date: '2026-09-28',
    lessonNumber: 8,
    lessonTopic: "Zero-shot va few-shot prompting tushunchalari",
    quarter: 1,
    records: { 'AI-45-01': 'present', 'AI-45-03': 'present', 'AI-45-04': 'present' },
    grades: { 'AI-45-01': 5, 'AI-45-03': 5, 'AI-45-04': 5 },
    gradeComments: {
      'AI-45-01': "Few-shot namunalarini mustaqil kiritdi",
      'AI-45-03': "Amaliyotda natija ko'rsatdi",
      'AI-45-04': "A'lo darajadagi taqqoslash",
    },
  },
  {
    date: '2026-09-30',
    lessonNumber: 9,
    lessonTopic: "Chain-of-thought o'rniga bosqichma-bosqich vazifa dizayni",
    quarter: 1,
    records: { 'AI-45-01': 'present', 'AI-45-03': 'present', 'AI-45-04': 'present' },
    grades: { 'AI-45-01': 5, 'AI-45-03': 5, 'AI-45-04': 5 },
    gradeComments: {
      'AI-45-01': "Mantiqiy zanjirni bexato tuzdi",
      'AI-45-03': "Bosqichma-bosqich dizaynni to'liq himoya qildi",
      'AI-45-04': "Bugungi darsda faol ishtirok etdi",
    },
  },
];

// UY VAZIFALARI
export const INITIAL_HOMEWORK: Homework[] = [
  {
    id: 'HW-01',
    lessonNumber: 8,
    title: "Zero-shot va Few-shot Prompting Taqqoslash",
    moduleName: "Prompt Muhandisligi Asoslari",
    description: "ChatGPT va Claude yordamida bitta murakkab vazifani avval noaniq, keyin few-shot uslubida berib, javoblarni tahlil qiling.",
    dueDate: "2026-10-18",
    maxScore: 100,
    difficulty: "O'rta",
  },
  {
    id: 'HW-02',
    lessonNumber: 9,
    title: "Bosqichma-bosqich Vazifa Dizayni (Chain-of-thought)",
    moduleName: "Mantiqiy AI Modellari",
    description: "Sun'iy intellektga mantiqiy masalani bosqichlarga bo'lib yechish bo'yicha prompt tuzing va natijani havola ko'rinishida yuboring.",
    dueDate: "2026-10-22",
    maxScore: 100,
    difficulty: "Murakkab",
  },
];

// TOPSHIRIQ JAVOBLARI
export const INITIAL_SUBMISSIONS: StudentSubmission[] = [
  {
    id: 'SUB-101',
    homeworkId: 'HW-01',
    studentId: 'AI-45-01',
    submittedAt: '2026-10-11 14:20',
    content: 'https://chatgpt.com/share/prompt-analiz-muhayyo',
    status: 'graded',
    score: 95,
    feedback: "A'lo darajada bajarilgan! Few-shot namunalari juda aniq tanlangan.",
  },
];
