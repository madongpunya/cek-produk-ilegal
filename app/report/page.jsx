'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, CheckCircle2, Image as ImageIcon } from 'lucide-react';

export default function ReportPage() {
  const [formData, setFormData] = useState({
    productName: '',
    location: '',
    description: '',
    reporterName: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = new FormData();
      dataToSend.append('productName', formData.productName);
      dataToSend.append('location', formData.location);
      dataToSend.append('description', formData.description);
      dataToSend.append('reporterName', formData.reporterName);
      if (formData.image) {
        dataToSend.append('image', formData.image);
      }

      const response = await fetch('/api/report', {
        method: 'POST',
        body: dataToSend
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({ productName: '', location: '', description: '', reporterName: '', image: null });
      } else {
        alert("Gagal mengirim laporan: " + result.error);
      }
    } catch (err) {
      console.error("Terjadi kesalahan:", err);
      alert("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="p-4 flex items-center justify-between border-b border-slate-800">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-300 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </Link>
        <h1 className="font-semibold text-lg">Formulir Pengaduan Produk</h1>
        <div className="w-16"></div>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center p-4 max-w-md mx-auto w-full">
        {success ? (
          <div className="w-full bg-emerald-950/40 border border-emerald-800 p-6 rounded-2xl text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h2 className="font-bold text-lg text-emerald-200">Laporan Berhasil Terkirim!</h2>
            <p className="text-sm text-slate-300">Laporan beserta nama pelapor dan foto bukti telah tercatat di database.</p>
            <button 
              onClick={() => setSuccess(false)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-medium text-sm transition-colors"
            >
              Kirim Laporan Lain
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitReport} className="w-full space-y-4 bg-slate-800/50 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nama Produk Temuan</label>
              <input 
                type="text" 
                name="productName"
                required
                placeholder="Contoh: Obat/Kosmetik/Makanan Ilegal" 
                value={formData.productName}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Lokasi Temuan / Toko</label>
              <input 
                type="text" 
                name="location"
                required
                placeholder="Contoh: Pasar Sentral / Toko A" 
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Keterangan / Alasan Kecurigaan</label>
              <textarea 
                name="description"
                required
                rows="3"
                placeholder="Jelaskan kondisi fisik produk atau izin edarnya..." 
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Kolom Input Nama Pelapor */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nama Pelapor (Opsional)</label>
              <input 
                type="text" 
                name="reporterName"
                placeholder="Nama Anda / Anonim" 
                value={formData.reporterName}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Unggah Foto Bukti Produk</label>
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
                <ImageIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <input 
                  type="file" 
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full text-xs text-slate-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-500 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-2"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Mengunggah & Mengirim...' : 'Kirim Laporan'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}