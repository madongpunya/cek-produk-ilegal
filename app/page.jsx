'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, AlertTriangle, ShieldCheck, FileText } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
      {/* Header / Navbar */}
      <header className="bg-white shadow-sm border-b border-slate-100 py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-8 h-8 text-red-600" />
          <span className="font-bold text-xl tracking-tight text-slate-900">CekProdukIlegal</span>
        </div>
        <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
          Public Safety Beta
        </span>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 py-12 text-center flex-grow flex flex-col justify-center items-center">
        <div className="inline-flex items-center justify-center p-3 bg-red-50 rounded-2xl mb-6 text-red-600">
          <AlertTriangle className="w-12 h-12" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Kenali & Laporkan Produk Ilegal dengan Kamera Anda
        </h1>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl leading-relaxed">
          Lindungi diri dan masyarakat dari peredaran produk tanpa izin atau berbahaya melalui pemindaian foto objek secara instan.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/scan" 
            className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-red-600/20 transition-all duration-200"
          >
            <Camera className="w-5 h-5" />
            Mulai Scan Objek
          </Link>
          <Link 
            href="/report" 
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold px-8 py-4 rounded-xl transition-all duration-200"
          >
            <FileText className="w-5 h-5" />
            Form Lapor Temuan
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-sm text-slate-500">
        <p>&copy; 2026 CekProdukIlegal System. Siap Deploy ke Vercel.</p>
      </footer>
    </main>
  );
}