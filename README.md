# 🚀 45-Maktab Sun'iy Intellekt OS — Cyber Dashboard

45-maktab ixtisoslashtirilgan **Sun'iy Intellekt** kursi uchun maxsus ishlab chiqilgan zamonaviy **Cyber OS / Glassmorphism HUD Dashboard** tizimi.

---

## ❓ Nega GitHub Pages'da sayt ochilmay yoki xato bo'lib qoladi?

### Asosiy sabab:
Loyiha zamonaviy **React + TypeScript + Vite** texnologiyasida yaratilgan. Asosiy sahifa `src/main.tsx` fayliga murojaat qiladi:
```html
<script type="module" src="/src/main.tsx"></script>
```
⚠️ **Brauzerlar `.tsx` (TypeScript/React) kodini to'g'ridan-to'g'ri o'qiy olmaydi.** Ular faqat toza `.js` (JavaScript) fayllarni tushunadi. 
Shu sababli brauzer konsolida:
> `Failed to load module script: The server responded with a non-JavaScript MIME type` yoki `404 Not Found`

xatosi chiqadi va ekran ochilmay, bo'sh bo'lib qoladi.

---

## ✅ YECHIM: Saytni GitHub Pages'da 1 daqiqada ishga tushirish

Loyiha ichiga maxsus **GitHub Actions (`.github/workflows/deploy.yml`)** avtomatlashtirilgan tizimi qo'shildi!

### Buni yoqish uchun:
1. GitHub'dagi o'z repository sahifangizga kiring.
2. Yuqoridagi **⚙️ Settings** tugmasini bosing.
3. Chap tarafdagi menyudan **Pages** bo'limini tanlang.
4. **Build and deployment** bo'limidagi **Source** menyusini oching:
   - *"Deploy from a branch"* o'rniga **"GitHub Actions"** ni tanlang!
5. Bo'ldi! Kodni GitHub'ga push qilishingiz bilan GitHub o'zi loyihani avtomatik yig'adi (`npm run build`) va jonli havolani (masalan: `https://username.github.io/repository/`) taqdim etadi.

---

## 💻 Kompyuterda (Local) ishga tushirish

Loyihani o'z kompyuteringizda ishlatish uchun:

```bash
# 1. Kerakli kutubxonalarni o'rnatish
npm install

# 2. Dasturni ishga tushirish
npm run dev
```
Brauzerda `http://localhost:3000` manzilini oching.

### 📦 Tayyor sayt paketini (dist) yaratish:
```bash
npm run build
```
Bu buyruqdan so'ng `dist/` papkasida to'liq tayyor, kompilyatsiya qilingan statik veb-sayt hosil bo'ladi.

---

## 🔑 Tizimga kirish ma'lumotlari

Tizimga kirish bitta yagona oynadan amalga oshiriladi:

- **Ustoz (Admin) uchun:**
  - Login: `mxojayev` (yoki `ustoz`)
  - Parol: `xojayev2013`
  - *Imkoniyatlari:* O'quvchilarni qo'shish/tahrirlash, login va parollarni belgilash, oylik to'lovlarni nazorat qilish, davomat olish, baholash, sertifikat berish.

- **O'quvchilar uchun:**
  - O'quvchilar login va parollari Ustoz tomonidan O'quvchilar bazasida yaratiladi (masalan: `azizbek` / `ai45_user1`).
  - *Imkoniyatlari:* Shaxsiy davomat ko'rsatkichi, uy vazifalari topshirish, oylik to'lov holati, o'zlashtirish va shaxsiy sertifikat.
