import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const productName = formData.get('productName');
    const location = formData.get('location');
    const description = formData.get('description');
    const imageFile = formData.get('image');

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Konfigurasi Supabase belum lengkap.' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    let imageUrl = null;

    // Jika ada file gambar yang diunggah
    if (imageFile && imageFile.size > 0) {
      const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, '_')}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('report-images')
        .upload(fileName, imageFile);

      if (uploadError) {
        return NextResponse.json({ error: 'Gagal mengunggah gambar: ' + uploadError.message }, { status: 400 });
      }

      // Ambil Public URL dari gambar yang diunggah
      const { data: publicUrlData } = supabase.storage
        .from('report-images')
        .getPublicUrl(fileName);

      imageUrl = publicUrlData.publicUrl;
    }

    // Simpan data laporan beserta URL gambar ke tabel 'reports'
    // Pastikan tabel Anda sudah memiliki kolom 'image_url' (tipe text)
    const { error: dbError } = await supabase
      .from('reports')
      .insert([
        { 
          product_name: productName, 
          location: location, 
          description: description,
          image_url: imageUrl 
        }
      ]);

    if (dbError) {
      return NextResponse.json({ error: 'Gagal menyimpan ke database: ' + dbError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Laporan dan gambar berhasil disimpan!' });

  } catch (err) {
    console.error("Kesalahan server:", err);
    return NextResponse.json({ error: 'Gagal memproses server: ' + err.message }, { status: 500 });
  }
}