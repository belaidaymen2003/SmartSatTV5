import Sidebar from '../../components/Admin/Sidebar'
import '../globals.css'

export const metadata = {
  title: 'Admin - HOTFLIX',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <Sidebar />
      <main className="ml-72 p-8 min-h-screen">
        <div className="max-w-[1400px] mx-auto">{children}</div>
      </main>
    </div>
  )
}
