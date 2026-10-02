import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Data yang diterima dari frontend:", body); // Cek terminal VS Code nanti

    const searchTerm = body.searchTerm;

    if (!searchTerm || searchTerm.trim() === '') {
      return NextResponse.json({
        status: 'ilegal',
        name: 'Nama Produk Kosong',
        message: 'Mohon ketik nama produk pada kolom pencarian.'
      });
    }

    // Query ke tabel products di Supabase
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .ilike('product_name', `%${searchTerm.trim()}%`);

    if (error) {
      console.error("Error dari Supabase:", error);
      return NextResponse.json({ status: 'ilegal', name: 'Database Error', message: error.message });
    }

    if (!products || products.length === 0) {
      return NextResponse.json({
        status: 'ilegal',
        name: 'Produk Tidak Ditemukan',
        message: `Kata kunci "${searchTerm}" tidak ada di database.`
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