'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, CheckCircle2, FileText } from 'lucide-react';

export default function ReportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    location: '',
    description: '',
    reporterName: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulasi pengiriman data ke server/database
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white shadow-sm border-b border-slate-100 py-4 px-6 flex justify-between items-center">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium">
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali ke Beranda</span>
        </Link>
        <span className="font-bold text-lg text-slate-900">Form Lapor Produk Ilegal</span>
        <div className="w-24"></div>
      </header>

      {/* Main Form Content */}
      <main className="max-w-xl mx-auto px-6 py-10 flex-grow w-full">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-slate-900">Formulir Pengaduan Masyarakat</h2>
                  <p className="text-xs text-slate-500">Laporkan temuan produk tanpa izin edar atau mencurigakan.</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Produk / Merek</label>
                <input 
                  type="text" 
                  name="productName"
                  required
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="Contoh: Kosmetik / Makanan Tanpa Label"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Lokasi Temuan (Nama Toko / Alamat)</label>
                <input 
                  type="text" 
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Contoh: Toko Berkah Jaya, Jl. Merdeka No. 10"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Keterangan / Alasan Kecurigaan</label>
                <textarea 
                  name="description"
                  rows="4"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Jelaskan kondisi fisik produk atau mengapa dicurigai ilegal..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Pelapor (Opsional)</label>
                <input 
                  type="text" 
                  name="reporterName"
                  value={formData.reporterName}
                  onChange={handleChange}
                  placeholder="Nama Anda"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-5 h-5" />
                Kirim Laporan
              </button>
            </form>
          ) : (
            <div className="text-center py-10 space-y-4">
              <div className="inline-flex p-4 bg-emerald-50 text-emerald-600 rounded-full">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Laporan Berhasil Terkirim!</h2>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                Terima kasih atas partisipasi Anda dalam mengawasi peredaran produk. Laporan Anda telah dicatat oleh sistem.
              </p>
              <div className="pt-4">
                <Link 
                  href="/"
                  className="inline-block px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm"
                >
                  Kembali ke Beranda
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}