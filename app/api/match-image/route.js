import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { searchTerm } = await request.json();

    // Jika tidak ada kata kunci yang dicari
    if (!searchTerm) {
      return NextResponse.json({
        status: 'ilegal',
        name: 'Produk Tidak Dikenali',
        message: 'Masukkan atau deteksi nama produk pada kemasan.'
      });
    }

    // Melakukan pencarian data secara konsisten berdasarkan kemiripan nama produk di Supabase
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .ilike('product_name', `%${searchTerm}%`)
      .limit(1);

    if (error || !products || products.length === 0) {
      return NextResponse.json({
        status: 'ilegal',
        name: 'Produk Tidak Terdaftar / Ilegal',
        message: 'Produk ini tidak ditemukan di dalam database resmi pengawasan.'
      });
    }

    const matchedProduct = products[0];

    // Hasil akan konsisten sesuai dengan apa yang tersimpan di database untuk produk tersebut
    return NextResponse.json({
      status: matchedProduct.status, // Konsisten 'legal' atau 'ilegal'
      name: matchedProduct.product_name,
      message: matchedProduct.description || 'Status perizinan terverifikasi.',
      referenceImage: matchedProduct.image_url
    });

  } catch (err) {
    console.error("Kesalahan server:", err);
    return NextResponse.json({ error: 'Gagal memproses data' }, { status: 500 });
  }
}