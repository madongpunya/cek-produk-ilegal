import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request) {
  try {
    const body = await request.json();
    const { productName, location, description, reporterName } = body;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Konfigurasi Supabase belum lengkap.' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Menyimpan data dari form ke tabel 'reports' di Supabase
    const { data, error } = await supabase
      .from('reports') // Ubah menjadi 'report' jika nama tabel Anda tidak pakai 's'
      .insert([
        { 
          product_name: productName, 
          location: location, 
          description: description,
          reporter_name: reporterName || 'Anonim'
        }
      ]);

    if (error) {
      console.error("Gagal insert ke Supabase:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Laporan berhasil dicatat ke database!' });

  } catch (err) {
    console.error("Kesalahan server:", err);
    return NextResponse.json({ error: 'Gagal memproses laporan server' }, { status: 500 });
  }
}