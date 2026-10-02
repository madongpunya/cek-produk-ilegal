import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request) {
  try {
    // 1. Mengambil data yang dikirimkan dari form (termasuk file dan teks)
    const formData = await request.formData();
    const productName = formData.get('productName');
    const location = formData.get('location');
    const description = formData.get('description');
    const reporterName = formData.get('reporterName'); // Nama Pelapor
    const imageFile = formData.get('image');

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Konfigurasi Supabase belum lengkap.' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    let imageUrl = null;

    // 2. Proses unggah gambar ke Supabase Storage jika ada file yang dipilih
    if (imageFile && imageFile.size > 0) {
      const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, '_')}`;
      
      const { error: uploadError } = await supabase.storage
        .from('report-images')
        .upload(fileName, imageFile);

      if (uploadError) {
        return NextResponse.json({ error: 'Gagal mengunggah gambar: ' + uploadError.message }, { status: 400 });
      }

      // Mengambil URL publik gambar yang baru saja diunggah
      const { data: publicUrlData } = supabase.storage
        .from('report-images')
        .getPublicUrl(fileName);

      imageUrl = publicUrlData.publicUrl;
    }

    // 3. Menyimpan seluruh data laporan ke tabel 'reports' di Supabase
    const { error: dbError } = await supabase
      .from('reports')
      .insert([
        { 
          product_name: productName, 
          location: location, 
          description: description,
          reporter_name: reporterName || 'Anonim', // Jika kosong, otomatis bernilai 'Anonim'
          image_url: imageUrl,                      // Link foto bukti
          created_at: new Date().toISOString()      // Waktu pelaporan saat ini
        }
      ]);

    if (dbError) {
      return NextResponse.json({ error: 'Gagal menyimpan ke database: ' + dbError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Laporan, nama pelapor, waktu, dan foto berhasil dicatat ke database!' });

  } catch (err) {
    console.error("Kesalahan server:", err);
    return NextResponse.json({ error: 'Gagal memproses server: ' + err.message }, { status: 500 });
  }
}