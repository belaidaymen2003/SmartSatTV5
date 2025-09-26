import './globals.css';
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
    <body className="min-h-screen bg-gradient-to-br  bg-fixed from-slate-900 via-purple-900 to-slate-900 text-white">
      {children}
    </body>
    </html>
  );
}
