import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request) {
  try {
    const { searchTerm } = await request.json();

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        status: 'ilegal',
        name: 'Konfigurasi Error',
        message: 'Variabel lingkungan Supabase belum terbaca di server.'
      });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Ambil seluruh data dari tabel 'product' terlebih dahulu untuk diperiksa manual
    const { data: products, error } = await supabase
      .from('product')
      .select('*');

    if (error) {
      return NextResponse.json({
        status: 'ilegal',
        name: 'Database Error',
        message: error.message
      });
    }

    if (!products || products.length === 0) {
      return NextResponse.json({
        status: 'ilegal',
        name: 'Tabel Kosong',
        message: 'Tidak ada data sama sekali di dalam tabel product Supabase.'
      });
    }

    // Jika pengguna mengetik kata kunci, lakukan pencarian yang fleksibel
    let matchedProduct = null;
    if (searchTerm && searchTerm.trim() !== '') {
      const keyword = searchTerm.trim().toLowerCase();
      matchedProduct = products.find(p => 
        p.product_name && p.product_name.toLowerCase().includes(keyword)
      );
    } else {
      // Jika kosong, ambil data pertama sebagai sampel
      matchedProduct = products[0];
    }

    if (!matchedProduct) {
      return NextResponse.json({
        status: 'ilegal',
        name: 'Produk Tidak Ditemukan',
        message: `Kata kunci "${searchTerm}" tidak cocok dengan data di database.`
      });
    }

    return NextResponse.json({
      status: matchedProduct.status, // 'legal' atau 'ilegal'
      name: matchedProduct.product_name,
      message: matchedProduct.description || 'Status perizinan terverifikasi.',
      referenceImage: matchedProduct.image_url
    });

  } catch (err) {
    return NextResponse.json({ 
      status: 'ilegal', 
      name: 'Server Error', 
      message: err.message 
    }, { status: 500 });
  }
}