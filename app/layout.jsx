import './globals.css';

export const metadata = {
  title: 'Cek Produk Ilegal',
  description: 'Aplikasi pengenalan dan pelaporan produk ilegal berbasis web',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-slate-50 text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}