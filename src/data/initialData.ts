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

const createInitialMonthlyPayments = (isScholarship: boolean, pendingMonth?: PaymentMonthKey) => {
  const result: Record<PaymentMonthKey, { status: 'paid' | 'pending' | 'scholarship'; paidDate?: string; amount: number }> = {
    sentyabr: { status: isScholarship ? 'scholarship' : 'paid', paidDate: '2026-09-05', amount: isScholarship ? 0 : 450000 },
    oktyabr: {
      status: isScholarship ? 'scholarship' : pendingMonth === 'oktyabr' ? 'pending' : 'paid',
      paidDate: pendingMonth === 'oktyabr' ? undefined : '2026-10-02',
      amount: isScholarship ? 0 : 450000,
    },
    noyabr: { status: isScholarship ? 'scholarship' : 'pending', amount: isScholarship ? 0 : 450000 },
    dekabr: { status: isScholarship ? 'scholarship' : 'pending', amount: isScholarship ? 0 : 450000 },
    yanvar: { status: isScholarship ? 'scholarship' : 'pending', amount: isScholarship ? 0 : 450000 },
    fevral: { status: isScholarship ? 'scholarship' : 'pending', amount: isScholarship ? 0 : 450000 },
    mart: { status: isScholarship ? 'scholarship' : 'pending', amount: isScholarship ? 0 : 450000 },
    aprel: { status: isScholarship ? 'scholarship' : 'pending', amount: isScholarship ? 0 : 450000 },
    may: { status: isScholarship ? 'scholarship' : 'pending', amount: isScholarship ? 0 : 450000 },
  };
  return result;
};

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

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'AI-45-01',
    fullName: 'Azizbek Rahimov',
    username: 'azizbek',
    password: 'ai45_user1',
    phone: '+998 90 123 45 67',
    telegramUsername: '@azizbek_ai',
    grade: '10-A sinf',
    enrolledDate: '2026-09-05',
    monthlyPayments: createInitialMonthlyPayments(false),
    avatarSeed: 'Azizbek',
    notes: 'Prompt Engineering va matnli modellarda a\'lochi o\'quvchi.'
  },
  {
    id: 'AI-45-02',
    fullName: 'Madina Yoqubova',
    username: 'madina',
    password: 'ai45_user2',
    phone: '+998 93 456 78 90',
    telegramUsername: '@madina_yoqubova',
    grade: '10-B sinf',
    enrolledDate: '2026-09-05',
    monthlyPayments: createInitialMonthlyPayments(true),
    scholarshipReason: 'Maktab olimpiadasi g\'olibi (100% Grant)',
    avatarSeed: 'Madina',
    notes: 'Generativ dizayn va Midjourney promptlarida iqtidorli.'
  },
  {
    id: 'AI-45-03',
    fullName: 'Jasur Rustamov',
    username: 'jasur',
    password: 'ai45_user3',
    phone: '+998 94 987 65 43',
    telegramUsername: '@jasur_rustam',
    grade: '9-V sinf',
    enrolledDate: '2026-09-08',
    monthlyPayments: createInitialMonthlyPayments(false),
    avatarSeed: 'Jasur',
    notes: 'Telegram bot va avtomatlashtirishga qiziqadi.'
  },
  {
    id: 'AI-45-04',
    fullName: 'Nilufar Ergasheva',
    username: 'nilufar',
    password: 'ai45_user4',
    phone: '+998 97 222 33 44',
    telegramUsername: '@nilufar_ergash',
    grade: '11-A sinf',
    enrolledDate: '2026-09-06',
    monthlyPayments: createInitialMonthlyPayments(false),
    avatarSeed: 'Nilufar',
    notes: 'Canva AI va taqdimotlar tayyorlashda faol.'
  },
  {
    id: 'AI-45-05',
    fullName: 'Sardor Aliyev',
    username: 'sardor',
    password: 'ai45_user5',
    phone: '+998 99 777 88 99',
    telegramUsername: '@sardor_aliyev',
    grade: '10-A sinf',
    enrolledDate: '2026-09-09',
    monthlyPayments: createInitialMonthlyPayments(false, 'oktyabr'),
    avatarSeed: 'Sardor',
    notes: 'Oktyabr oyi to\'lovi 15-sentyabrgacha kechiktirilgan.'
  },
  {
    id: 'AI-45-06',
    fullName: 'Farangiz Karimova',
    username: 'farangiz',
    password: 'ai45_user6',
    phone: '+998 91 333 44 55',
    telegramUsername: '@farangiz_karim',
    grade: '9-B sinf',
    enrolledDate: '2026-09-05',
    monthlyPayments: createInitialMonthlyPayments(false),
    avatarSeed: 'Farangiz',
    notes: 'Audio va video generatsiya (Runway, ElevenLabs) bo\'yicha qiziqadi.'
  },
  {
    id: 'AI-45-07',
    fullName: 'Bekzod Mahmudov',
    username: 'bekzod',
    password: 'ai45_user7',
    phone: '+998 95 111 22 33',
    telegramUsername: '@bekzod_m',
    grade: '11-B sinf',
    enrolledDate: '2026-09-10',
    monthlyPayments: createInitialMonthlyPayments(true),
    scholarshipReason: 'STEM iqtidorli yoshlar stipendiyasi',
    avatarSeed: 'Bekzod',
    notes: 'Code AI va HTML/CSS sahifa yaratishda yuqori ball.'
  },
  {
    id: 'AI-45-08',
    fullName: 'Shahlo Ziyodullayeva',
    username: 'shahlo',
    password: 'ai45_user8',
    phone: '+998 90 888 99 00',
    telegramUsername: '@shahlo_ziyo',
    grade: '10-V sinf',
    enrolledDate: '2026-09-07',
    monthlyPayments: createInitialMonthlyPayments(false),
    avatarSeed: 'Shahlo',
    notes: 'Barcha topshiriqlarni muddatidan oldin yakunlaydi.'
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    date: '2026-09-07',
    lessonNumber: 1,
    lessonTopic: "Sun'iy intellekt nima? AI ning kundalik hayotdagi o'rni",
    records: {
      'AI-45-01': 'present',
      'AI-45-02': 'present',
      'AI-45-03': 'present',
      'AI-45-04': 'present',
      'AI-45-05': 'present',
      'AI-45-06': 'present',
      'AI-45-07': 'present',
      'AI-45-08': 'present',
    }
  },
  {
    date: '2026-09-09',
    lessonNumber: 2,
    lessonTopic: "AI turlari: tor AI, generativ AI va kelajak AI tushunchasi",
    records: {
      'AI-45-01': 'present',
      'AI-45-02': 'present',
      'AI-45-03': 'absent',
      'AI-45-04': 'present',
      'AI-45-05': 'present',
      'AI-45-06': 'present',
      'AI-45-07': 'present',
      'AI-45-08': 'present',
    }
  },
  {
    date: '2026-09-14',
    lessonNumber: 3,
    lessonTopic: "ChatGPT bilan xavfsiz va samarali ishlash asoslari",
    records: {
      'AI-45-01': 'present',
      'AI-45-02': 'present',
      'AI-45-03': 'present',
      'AI-45-04': 'excused',
      'AI-45-05': 'present',
      'AI-45-06': 'present',
      'AI-45-07': 'present',
      'AI-45-08': 'present',
    }
  },
  {
    date: '2026-09-16',
    lessonNumber: 4,
    lessonTopic: "Prompt anatomiyasi: rol, vazifa, kontekst va natija formati",
    records: {
      'AI-45-01': 'present',
      'AI-45-02': 'present',
      'AI-45-03': 'present',
      'AI-45-04': 'present',
      'AI-45-05': 'absent',
      'AI-45-06': 'present',
      'AI-45-07': 'present',
      'AI-45-08': 'present',
    }
  },
  {
    date: '2026-09-21',
    lessonNumber: 5,
    lessonTopic: "Aniq topshiriq berish: noaniq va kuchli promptlar",
    records: {
      'AI-45-01': 'present',
      'AI-45-02': 'present',
      'AI-45-03': 'present',
      'AI-45-04': 'present',
      'AI-45-05': 'present',
      'AI-45-06': 'present',
      'AI-45-07': 'present',
      'AI-45-08': 'present',
    }
  },
  {
    date: '2026-09-23',
    lessonNumber: 6,
    lessonTopic: "Kontekst berish va AI javobining sifatini oshirish",
    records: {
      'AI-45-01': 'present',
      'AI-45-02': 'present',
      'AI-45-03': 'present',
      'AI-45-04': 'present',
      'AI-45-05': 'present',
      'AI-45-06': 'excused',
      'AI-45-07': 'present',
      'AI-45-08': 'present',
    }
  }
];

export const INITIAL_HOMEWORK: Homework[] = [
  {
    id: 'HW-01',
    lessonNumber: 4,
    moduleName: '1-Chorak: Prompt Asoslari',
    title: 'Mukammal prompt anatomiyasi: 4 qismli formula yaratish',
    description: 'Rol, vazifa, kontekst va formatdan iborat o\'zbek tilidagi ta\'lim promptini ishlab chiqing va ChatGPT orqali natijani sinang.',
    dueDate: '2026-09-20',
    maxScore: 100,
    difficulty: 'Oson',
    starterCodeOrLink: 'https://chatgpt.com'
  },
  {
    id: 'HW-02',
    lessonNumber: 6,
    moduleName: '1-Chorak: Prompt Asoslari',
    title: 'Noaniq promptni kuchli professional promptga aylantirish',
    description: '3 ta zaif savolni oling va ularni kontekst, auditoriya va cheklovlar qo\'shilgan holda yuqori sifatli promptga aylantiring.',
    dueDate: '2026-09-27',
    maxScore: 100,
    difficulty: "O'rta",
    starterCodeOrLink: 'https://gemini.google.com'
  },
  {
    id: 'HW-03',
    lessonNumber: 11,
    moduleName: '1-Chorak: Katta Matnlar va Claude',
    title: 'Claude bilan 5 sahifalik tarixiy maqolani tahlil qilish',
    description: 'Tarixiy matnni Claude ga yuklang va undan 10 ta asosiy voqea xronologiyasi hamda 5 ta savol-javob testini tayyorlashni so\'rang.',
    dueDate: '2026-10-05',
    maxScore: 100,
    difficulty: "O'rta",
    starterCodeOrLink: 'https://claude.ai'
  },
  {
    id: 'HW-04',
    lessonNumber: 17,
    moduleName: '1-Chorak: Prompt Engineering Mini-Loyiha',
    title: 'Maktab yordamchi AI assistenti prompt tizimini yozish',
    description: '45-maktab o\'quvchilari uchun matematika yoki ingliz tili bo\'yicha tushuntiruvchi shaxsiy AI repetitor tizimi ssenariysini yarating.',
    dueDate: '2026-10-14',
    maxScore: 100,
    difficulty: 'Murakkab',
    starterCodeOrLink: 'https://github.com/maktab45-ai/mini-project-prompt'
  }
];

export const INITIAL_SUBMISSIONS: StudentSubmission[] = [
  {
    id: 'SUB-01',
    homeworkId: 'HW-01',
    studentId: 'AI-45-01',
    submittedAt: '2026-09-18 17:30',
    content: 'https://chatgpt.com/share/prompt-anatomy-hw1',
    score: 98,
    feedback: 'Ajoyib natija! 4 qismli formula to\'liq qo\'llanilgan.',
    status: 'graded'
  },
  {
    id: 'SUB-02',
    homeworkId: 'HW-01',
    studentId: 'AI-45-02',
    submittedAt: '2026-09-19 20:15',
    content: 'https://chatgpt.com/share/madina-prompt-format',
    score: 100,
    feedback: 'Mukammal yozilgan vazifa va aniq kontekst.',
    status: 'graded'
  },
  {
    id: 'SUB-03',
    homeworkId: 'HW-02',
    studentId: 'AI-45-01',
    submittedAt: '2026-09-25 19:40',
    content: 'https://gemini.google.com/share/context-enhancement',
    score: 95,
    feedback: 'Zaif promptlar juda puxta qayta ishlangan.',
    status: 'graded'
  },
  {
    id: 'SUB-04',
    homeworkId: 'HW-02',
    studentId: 'AI-45-04',
    submittedAt: '2026-09-26 21:00',
    content: 'https://gemini.google.com/share/nilufar-hw2',
    score: 97,
    feedback: 'Cheklovlar qoidasi to\'g\'ri tushuntirilgan.',
    status: 'graded'
  }
];
