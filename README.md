# Full-Stack + Telegram Bot

React (Vite) + Express + MongoDB + JWT + Telegraf asosida qurilgan demo loyiha.
Mono-repo: `backend/` va `frontend/` bitta repozitoriyada.

| Qatlam | Texnologiya |
|--------|-------------|
| Frontend | React JS (Vite) + Tailwind CSS + Zustand |
| Backend | Node.js + Express.js |
| Ma'lumotlar bazasi | MongoDB + Mongoose |
| Autentifikatsiya | JWT + bcrypt |
| Telegram bot | Telegraf.js |
| Deploy | Netlify (frontend) + Render/Railway (backend) |

---

## Papka strukturasi

```
fullstack-telegram-bot/
├── backend/
│   ├── server.js              # Kirish nuqtasi: DB → server → bot
│   ├── .env.example
│   └── src/
│       ├── app.js             # Express sozlamalari (CORS, route, error handler)
│       ├── config/db.js       # MongoDB ulanishi
│       ├── models/            # User, Product, Order
│       ├── controllers/       # auth, user, product, order, stats
│       ├── routes/            # /api/* route'lar
│       ├── middleware/        # protect/admin guard, error handler
│       ├── utils/             # asyncHandler, generateToken, seed
│       └── bot/               # Telegram bot
│           ├── index.js       # Telegraf instance, polling/webhook, notifyAdmins
│           ├── commands/      # user + admin buyruqlari
│           ├── scenes/        # buyurtma wizard
│           ├── keyboards/     # inline + reply keyboard
│           └── middlewares/   # adminOnly
└── frontend/
    └── src/
        ├── api/axios.js       # JWT interceptor + 401 auto-logout
        ├── store/authStore.js # Zustand (persist)
        ├── components/        # Navbar, Loader, ProtectedRoute, AdminRoute
        └── pages/             # Home, Login, Register, Products, Profile, AdminDashboard
```

---

## 1. Lokal ishga tushirish

### Talablar
- Node.js 18+
- MongoDB (lokal yoki MongoDB Atlas)
- Telegram bot tokeni ([@BotFather](https://t.me/BotFather) dan oling)

### Backend

```bash
cd backend
npm install
cp .env.example .env       # va qiymatlarni to'ldiring
npm run seed               # test ma'lumotlari (admin@example.com / admin123)
npm run dev                # http://localhost:5000
```

`.env` muhim qiymatlari:
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — uzun tasodifiy satr
- `BOT_TOKEN` — BotFather tokeni
- `ADMIN_TELEGRAM_IDS` — admin Telegram ID lari (vergul bilan: `111,222`)
- `SERVER_URL` — **bo'sh** qoldiring (lokalda polling ishlaydi)

> O'z Telegram ID ingizni bilish uchun botga `/info` yuboring — javobida ID ko'rinadi.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env       # VITE_API_URL va VITE_BOT_USERNAME ni to'ldiring
npm run dev                # http://localhost:5173
```

---

## 2. Telegram bot buyruqlari

### Foydalanuvchi
| Buyruq | Vazifa |
|--------|--------|
| `/start` | Botni ishga tushirish, xush kelibsiz |
| `/help` | Buyruqlar ro'yxati |
| `/info` | O'z profilini ko'rish |
| `/products` (`/items`) | Mahsulotlar ro'yxati |
| `/order` | Buyurtma berish (wizard) |

### Admin (faqat `ADMIN_TELEGRAM_IDS` dagilar)
| Buyruq | Vazifa |
|--------|--------|
| `/admin` | Admin panel |
| `/stats` | Umumiy statistika |
| `/users` | Foydalanuvchilar ro'yxati |
| `/broadcast <matn>` | Hammaga xabar yuborish |

Bot ro'yxatdan o'tish va yangi buyurtmada adminlarga avtomatik xabar yuboradi.

---

## 3. API endpoint'lar

| Metod | Endpoint | Ruxsat | Tavsif |
|-------|----------|--------|--------|
| POST | `/api/auth/register` | Public | Ro'yxatdan o'tish |
| POST | `/api/auth/login` | Public | Kirish |
| GET | `/api/auth/me` | Private | Joriy profil |
| PUT | `/api/users/profile` | Private | Profilni tahrirlash |
| GET | `/api/users` | Admin | Foydalanuvchilar |
| DELETE | `/api/users/:id` | Admin | O'chirish |
| GET | `/api/products` | Public | Ro'yxat (search, page, limit) |
| GET | `/api/products/:id` | Public | Bittasi |
| POST | `/api/products` | Admin | Qo'shish |
| PUT | `/api/products/:id` | Admin | Tahrirlash |
| DELETE | `/api/products/:id` | Admin | O'chirish |
| POST | `/api/orders` | Private | Buyurtma yaratish |
| GET | `/api/orders/my` | Private | O'z buyurtmalarim |
| GET | `/api/orders` | Admin | Barcha buyurtmalar |
| PUT | `/api/orders/:id/status` | Admin | Status o'zgartirish |
| GET | `/api/stats` | Admin | Statistika |
| GET | `/api/health` | Public | Server holati |

Postman collection: `docs/postman_collection.json` (import qiling, `{{base_url}}` va `{{token}}` o'zgaruvchilarni sozlang).

---

## 4. Produksiyaga deploy

### Backend (Render / Railway)
1. Repozitoriyani ulang, root sifatida `backend/` ni belgilang.
2. Build: `npm install`, Start: `npm start`.
3. Environment variables: `.env.example` dagi barchasini qo'shing.
4. **`SERVER_URL`** ga backend'ning public URL'ini yozing (masalan `https://myapp.onrender.com`) — shunda bot **webhook** rejimiga o'tadi.
5. `MONGO_URI` uchun **MongoDB Atlas** (cloud) ishlating.

### Frontend (Netlify)
1. Base directory: `frontend`, Build: `npm run build`, Publish: `dist`.
2. Environment: `VITE_API_URL=https://<backend-url>/api`, `VITE_BOT_USERNAME=<bot>`.
3. SPA redirect uchun `frontend/public/_redirects` fayl: `/*  /index.html  200`.

### CORS
Backend faqat `CLIENT_URL` (Netlify domeni) ga ruxsat beradi — `.env` da to'g'ri sozlang.

---

## 5. Topshirish ro'yxati (checklist)

- [ ] GitHub repo (to'liq commit tarixi)
- [ ] Frontend live URL (Netlify)
- [ ] Backend live URL (Render/Railway)
- [ ] Telegram bot username (@...)
- [ ] README.md (ushbu fayl)
- [ ] Postman collection (`docs/`)
- [ ] `.env.example` (haqiqiy qiymatlarsiz) ✅

---

## Git workflow (tavsiya)

```bash
git checkout -b feature/telegram-bot
# ... o'zgartirishlar ...
git add .
git commit -m "feat(bot): add admin commands and broadcast"
git push origin feature/telegram-bot
# keyin Pull Request oching
```

Commit xabarlari uchun [Conventional Commits](https://www.conventionalcommits.org):
`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`.
