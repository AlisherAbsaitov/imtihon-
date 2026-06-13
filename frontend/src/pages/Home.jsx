import { Link } from 'react-router-dom';

/**
 * Bosh sahifa. Telegram bot havolasi shu yerda ko'rsatiladi
 * (Texnik topshiriq Frontend: bot havolasi saytda ko'rinishi kerak).
 *///t.me/absaitov_alisher
export default function Home() {
   

   return (
     <section className="text-center">
       <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
         Full-Stack loyiha + Telegram bot
       </h1>
       <p className="max-w-2xl mx-auto mt-4 text-slate-600">
         React + Express + MongoDB + JWT asosida qurilgan demo do'kon.
         Buyurtmalar va bildirishnomalar Telegram bot orqali boshqariladi.
       </p>

       <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
         <Link
           to="/products"
           className="rounded-md bg-brand px-5 py-2.5 font-medium text-white hover:bg-brand-dark"
         >
           Mahsulotlarni ko'rish
         </Link>

         {/* Telegram bot havolasi */}
         <a
           href={`https://t.me/onlain_magazin777_bot`}
           target="_blank"
           rel="noopener noreferrer"
           className="rounded-md border border-brand px-5 py-2.5 font-medium text-brand hover:bg-brand/5"
         >
           Telegram botni ochish ↗
         </a>
       </div>
     </section>
   );
 }
