# 🚀 45-Maktab Sun'iy Intellekt OS — Cyber Dashboard

45-maktab ixtisoslashtirilgan **Sun'iy Intellekt** kursi uchun maxsus ishlab chiqilgan zamonaviy **Cyber OS / Glassmorphism HUD Dashboard** boshqaruv tizimi (5–11 sinflar uchun mo'ljallangan).

---

## 🎯 5–11 Sinflar uchun To'liq Moslashtirildi
- **Sinflar diapazoni:** 5-sinfdan 11-sinfgacha barcha sinflar (5-A, 5-B, ..., 11-A, 11-B, 11-V) qamrab olingan.
- **Filtrlar:** Boshqaruv paneli, O'quvchilar bazasi, Davomat jurnali va Oylik to'lovlar oynalarida 5, 6, 7, 8, 9, 10, 11-sinflar bo'yicha alohida saralash imkoniyati yaratilgan.
- **O'quvchi qo'shish va tahrirlash:** Yangi o'quvchi qo'shayotganda yoki tahrirlayotganda 5-11 sinflardan qulay tanlash (select/datalist) mavjud.

---

## ❓ Nega GitHub'da sayt ochilmay yoki xato bo'lib qolayotgan edi?

### 1. Brauzer `.tsx` ni to'g'ridan-to'g'ri o'qiy olmaydi:
Loyiha zamonaviy **React + TypeScript + Vite** texnologiyasida yozilgan. Asosiy sahifa `src/main.tsx` ga ulanadi. Brauzerlar esa faqat tayyor JavaScript (`.js`) ni o'qiy oladi. Shu sababli GitHub repository'ni to'g'ridan-to'g'ri branch orqali ochganda bo'sh oq sahifa yoki `404` xatosi chiqadi.

### 2. GitHub Actions dependency xatosi (Tuzatildi ✅):
Ilgari GitHub Actions CI/CD jarayonida npm kutubxonalari mos kelmasligi (esbuild / vite peer dependency ziddiyati) va `package-lock.json` yo'qligi tufayli build jarayoni to'xtab qolayotgan edi. 
- Bu ziddiyat to'liq bartaraf etildi.
- Yangi `.github/workflows/deploy.yml` fayli qo'shildi.
- `package-lock.json` to'g'ri generatsiya qilindi.
- GitHub Pages uchun `404.html` va `.nojekyll` avtomatik yaratilishi ta'minlandi.

---

## ✅ GitHub Pages'da Saytni 1 Daqiqada Ishga Tushirish

Loyihani GitHub Pages'da xatosiz ishga tushirish uchun quyidagi 3 qadamni bajaring:

1. **GitHub'dagi o'z repository sahifangizga kiring.**
2. Yuqori menyudan **⚙️ Settings** (Sozlamalar) bo'limini oching.
3. Chap ustundan **Pages** bandini bosing.
4. **Build and deployment** bo'limida **Source** menyusini oching va:
   - ⚡ **"GitHub Actions"** ni tanlang! (Hech qanday branch tanlash shart emas, aynan "GitHub Actions").
5. Tamom! GitHub Actions avtomatik ravishda loyihani yig'adi (`npm run build`) va 1–2 daqiqada sizga jonli havolani (masalan: `https://username.github.io/repo/`) taqdim etadi.

---

## 💻 Kompyuterda (Local) ishga tushirish

```bash
# 1. Kutubxonalarni o'rnatish
npm install

# 2. Dasturni ishga tushirish (Local dev server)
npm run dev

# 3. GitHub uchun tayyor paket (dist) yaratish
npm run build
```

---

## 🔑 Tizimga kirish ma'lumotlari

- **Ustoz (Admin) uchun:**
  - Login: `mxojayev` (yoki `ustoz`)
  - Parol: `xojayev2013`
  - *Imkoniyatlari:* 5-11 sinf o'quvchilarini boshqarish, unikal login/parollarni bir zumda generatsiya qilish, oylik to'lovlar nazorati (100 000 so'm), davomat olish, baholash va rasmiy sertifikat berish.

- **O'quvchilar uchun:**
  - Login va parol Ustoz tomonidan o'quvchilar bazasida avtomatik yaratiladi (masalan: ism-familiyaga qarab unikal qilib beriladi).
  - *Imkoniyatlari:* Shaxsiy davomat, uy vazifalarini ko'rish va topshirish, to'lov holati hamda shaxsiy AI sertifikati.
