import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request) {
  try {
    const { searchTerm, imageBase64 } = await request.json();

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        status: 'ilegal',
        name: 'Konfigurasi Error',
        message: 'Variabel lingkungan Supabase belum terbaca di server.'
      });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Ambil seluruh data produk dari Supabase
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

    // Jika kolom pencarian kosong atau tidak diisi saat memotret gelas/objek lain
    if (!searchTerm || searchTerm.trim() === '') {
      return NextResponse.json({
        status: 'ilegal',
        name: 'Produk Tidak Dikenali / Ilegal',
        message: 'Tidak ada kata kunci produk yang dimasukkan untuk verifikasi.'
      });
    }

    const keyword = searchTerm.trim().toLowerCase();
    
    // Cari produk yang benar-benar cocok dengan kata kunci
    const matchedProduct = products.find(p => 
      p.product_name && p.product_name.toLowerCase().includes(keyword)
    );

    // Jika kata kunci tidak cocok dengan database (misal memotret gelas tapi mengetik sembarangan atau kosong)
    if (!matchedProduct) {
      return NextResponse.json({
        status: 'ilegal',
        name: 'Produk Tidak Terdaftar / Ilegal',
        message: `Produk dengan kata kunci "${searchTerm}" tidak ditemukan di database resmi.`
      });
    }

    // Jika cocok, kembalikan data status aslinya
    return NextResponse.json({
      status: matchedProduct.status,
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