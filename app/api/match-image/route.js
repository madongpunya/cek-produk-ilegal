import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { searchTerm } = await request.json();

    if (!searchTerm || searchTerm.trim() === '') {
      return NextResponse.json({
        status: 'ilegal',
        name: 'Nama Produk Kosong',
        message: 'Mohon ketik nama produk pada kolom pencarian.'
      });
    }

    // Mengambil kata pertama dari input (misal: "Minyak" dari "Minyak Gosok Cap Bunga Kelor")
    // agar pencarian di database lebih mudah cocok.
    const keyword = searchTerm.trim().split(' ')[0];

    const { data: products, error } = await supabase
      .from('product')
      .select('*')
      .ilike('product_name', `%${keyword}%`);

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ 
        status: 'ilegal', 
        name: 'Database Error', 
        message: error.message 
      });
    }

    if (!products || products.length === 0) {
      return NextResponse.json({
        status: 'ilegal',
        name: 'Produk Tidak Ditemukan / Ilegal',
        message: `Produk dengan kata kunci "${searchTerm}" tidak terdaftar di database.`
      });
    }

    const matchedProduct = products[0];

    return NextResponse.json({
      status: matchedProduct.status,
      name: matchedProduct.product_name,
      message: matchedProduct.description || 'Status perizinan terverifikasi.',
      referenceImage: matchedProduct.image_url
    });

  } catch (err) {
    console.error("Kesalahan server:", err);
    return NextResponse.json({ error: 'Gagal memproses data server' }, { status: 500 });
  }
}