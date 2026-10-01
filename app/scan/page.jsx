'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Camera, ArrowLeft, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ScanPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imgDataUrl, setImgDataUrl] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  // Menyalakan kamera perangkat saat halaman dibuka
  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Gagal mengakses kamera: ", err);
        alert("Pastikan Anda memberikan izin akses kamera pada browser.");
      }
    }
    setupCamera();

    // Cleanup: matikan stream kamera saat berpindah halaman
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Fungsi untuk mengambil foto dari video stream
  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setImgDataUrl(dataUrl);

      // Simulasi proses analisis objek
      simulateAnalysis();
    }
  };

  // Simulasi analisis objek
  const simulateAnalysis = () => {
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      setScanning(false);
      const isIllegal = Math.random() > 0.5;
      if (isIllegal) {
        setResult({
          status: 'illegal',
          name: 'Produk Tanpa Label / Indikasi Ilegal',
          message: 'Terindikasi produk ilegal atau palsu. Nomor registrasi tidak valid dalam sistem.',
          risk: 'Tinggi'
        });
      } else {
        setResult({
          status: 'legal',
          name: 'Produk Terdaftar Resmi (Sampel)',
          message: 'Produk terverifikasi aman dan memiliki izin edar resmi yang aktif.',
          risk: 'Aman'
        });
      }
    }, 2000);
  };

  const handleReset = () => {
    setImgDataUrl(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Top Bar */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-300 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </Link>
        <h1 className="font-semibold text-lg">Scanner Objek Produk</h1>
        <div className="w-16"></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col items-center justify-center p-4 max-w-md mx-auto w-full">
        {!imgDataUrl ? (
          <div className="relative w-full aspect-[3/4] bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute border-2 border-dashed border-white/50 w-64 h-64 rounded-xl pointer-events-none flex items-center justify-center">
              <span className="text-xs bg-black/60 text-white px-2 py-1 rounded">Arahkan ke kemasan produk</span>
            </div>

            {/* Capture Button */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
              <button 
                onClick={handleCapture}
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              >
                <div className="w-14 h-14 bg-red-600 rounded-full border-2 border-white"></div>
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center space-y-4">
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-slate-800">
              <img src={imgDataUrl} alt="Captured Product" className="w-full h-full object-cover" />
              {scanning && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center space-y-3">
                  <RefreshCw className="w-10 h-10 text-red-500 animate-spin" />
                  <p className="text-sm font-medium animate-pulse">Menganalisis objek produk...</p>
                </div>
              )}
            </div>

            {/* Result Box */}
            {!scanning && result && (
              <div className={`w-full p-4 rounded-xl border ${result.status === 'illegal' ? 'bg-red-950/40 border-red-800 text-red-200' : 'bg-emerald-950/40 border-emerald-800 text-emerald-200'}`}>
                <div className="flex items-start gap-3">
                  {result.status === 'illegal' ? (
                    <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h3 className="font-bold text-base">{result.name}</h3>
                    <p className="text-xs mt-1 opacity-90">{result.message}</p>
                  </div>
                </div>
              </div>
            )}

            {!scanning && (
              <button 
                onClick={handleReset}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium text-sm flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Scan Ulang
              </button>
            )}
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}