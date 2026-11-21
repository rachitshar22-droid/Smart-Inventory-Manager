import PrivateRoute from './PrivateRoute'
import { useAuth } from './AuthContext'
import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, Link } from 'react-router-dom'
import LoginForm from './LoginForm'
import DashBoard from './DashBoard'
import AddInventory from './AddInventory'
import ExpiringSoon from './ExpiringSoon'
import AddCustomer from './AddCustomer'
import CustomerList from './CustomerList'

function AppContent() {
  const { pathname } = useLocation()
  const { accessToken, authFetch, setAccessToken } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await authFetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
      })
    } catch (error) {
      console.log(error)
    }
    setAccessToken(null)
    setMenuOpen(false)
    navigate('/login')
  }

 return (
    <div className="min-h-screen bg-[#0A0F1E] text-white flex flex-col md:flex-row">
      {accessToken && pathname !== "/login" && (
        <>
          {/* Mobile Top Header */}
          <div className="md:hidden sticky top-0 z-40 flex items-center justify-between bg-[#0A0F1E] px-4 py-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-black flex items-center justify-center text-[18px] font-bold">
                🏪
              </div>
              <div>
                <span className="font-extrabold text-[15px] text-white tracking-tight block leading-none">
                  Meri Dukaan
                </span>
                <span className="text-[11px] text-slate-400">Stock + Udhar</span>
              </div>
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="px-4 py-2 bg-[#121A2E] text-white rounded-xl border border-slate-700 text-[13px] font-bold cursor-pointer"
            >
              {menuOpen ? 'Band Karo ✕' : 'Menu ☰'}
            </button>
          </div>

          {/* Mobile Backdrop */}
          {menuOpen && (
            <div
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
            />
          )}

          {/* Sidebar */}
          <aside
            className={`fixed md:sticky md:top-0 inset-y-0 left-0 z-50 w-65 h-screen bg-[#0A0F1E] border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 shrink-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
          >
            <div>
              {/* Brand */}
              <div className="px-5 py-5 border-b border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-black flex items-center justify-center shrink-0 text-[20px]">
                  🏪
                </div>
                <div>
                  <h1 className="text-[16px] font-extrabold text-white tracking-tight leading-none">
                    Meri Dukaan
                  </h1>
                  <p className="text-[12px] text-slate-400 mt-1">Stock + Udhar</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="px-3 py-5">
                <p className="px-3 text-[11px] font-bold tracking-widest text-slate-500 mb-3">MENU</p>
                <nav className="flex flex-col gap-1.5">
                  {/* 1. DASHBOARD */}
                  <Link
                    onClick={() => setMenuOpen(false)}
                    to="/dashboard"
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-[14px] font-semibold transition-all ${pathname === "/dashboard"
                        ? "bg-amber-400 text-black font-bold"
                        : "text-slate-300 hover:bg-[#121A2E] hover:text-white"
                      }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span>🏠</span> Home
                    </span>
                    {pathname === "/dashboard" && <span className="text-[14px] font-bold">→</span>}
                  </Link>

                  {/* 2. ADD STOCK */}
                  <Link
                    onClick={() => setMenuOpen(false)}
                    to="/addstock"
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-[14px] font-semibold transition-all ${pathname === "/addstock"
                        ? "bg-amber-400 text-black font-bold"
                        : "text-slate-300 hover:bg-[#121A2E] hover:text-white"
                      }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span>📦</span> Naya Maal Daalo
                    </span>
                    {pathname === "/addstock" && <span className="text-[14px] font-bold">→</span>}
                  </Link>

                  {/* 3. EXPIRING SOON */}
                  <Link
                    onClick={() => setMenuOpen(false)}
                    to="/expiringsoon"
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-[14px] font-semibold transition-all ${pathname === "/expiringsoon"
                        ? "bg-amber-400 text-black font-bold"
                        : "text-slate-300 hover:bg-[#121A2E] hover:text-white"
                      }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span>⏳</span> Khatam Hone Wala
                    </span>
                    {pathname === "/expiringsoon" && <span className="text-[14px] font-bold">→</span>}
                  </Link>

                  {/* 4. UDHAR ENTRY */}
                  <Link
                    onClick={() => setMenuOpen(false)}
                    to="/addCustomer"
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-[14px] font-semibold transition-all ${pathname === "/addCustomer" || pathname === "/editCustomer"
                        ? "bg-amber-400 text-black font-bold"
                        : "text-slate-300 hover:bg-[#121A2E] hover:text-white"
                      }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span>➕</span> Naya Udhar
                    </span>
                    {(pathname === "/addCustomer" || pathname === "/editCustomer") && <span className="text-[14px] font-bold">→</span>}
                  </Link>

                  {/* 5. UDHAR LIST */}
                  <Link
                    onClick={() => setMenuOpen(false)}
                    to="/customerList"
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-[14px] font-semibold transition-all ${pathname === "/customerList"
                        ? "bg-amber-400 text-black font-bold"
                        : "text-slate-300 hover:bg-[#121A2E] hover:text-white"
                      }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span>📒</span> Udhar Khata
                    </span>
                    {pathname === "/customerList" && <span className="text-[14px] font-bold">→</span>}
                  </Link>
                </nav>
              </div>
            </div>

            {/* Footer Tip + Logout - Menu ke sabse neeche */}
            <div className="p-3">
              
              <button
                onClick={handleLogout}
                className="mt-2.5 w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-[14px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all cursor-pointer"
              >
                <span>🚪</span> Logout
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-x-hidden bg-[#0A0F1E]">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/addstock" element={<PrivateRoute><AddInventory /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><DashBoard /></PrivateRoute>} />
          <Route path="/expiringsoon" element={<PrivateRoute><ExpiringSoon /></PrivateRoute>} />
          <Route path="/addCustomer" element={<PrivateRoute><AddCustomer /></PrivateRoute>} />
          <Route path="/editCustomer" element={<PrivateRoute><AddCustomer /></PrivateRoute>} />
          <Route path="/customerList" element={<PrivateRoute><CustomerList /></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}