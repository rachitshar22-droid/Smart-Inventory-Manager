import PrivateRoute from './PrivateRoute'
import { useAuth } from './AuthContext'
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, Link } from 'react-router-dom'
import LoginForm from './LoginForm'
import DashBoard from './DashBoard'
import AddInventory from './AddInventory'
import ExpiringSoon from './ExpiringSoon'
import AddCustomer from './AddCustomer'
import CustomerList from './CustomerList'
import { API_URL } from './config'

function AppContent() {
  const { pathname } = useLocation()
  const { accessToken, authFetch, setAccessToken } = useAuth()
  const navigate = useNavigate()

  const showNav = accessToken && pathname !== "/login"

  const isHomeTab = pathname === "/dashboard" || pathname === "/addstock"
  const isExpiringTab = pathname === "/expiringsoon"
  const isUdharTab = pathname === "/customerList" || pathname === "/addCustomer" || pathname === "/editCustomer"

  const handleLogout = async () => {
    try {
      await authFetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
      })
    } catch (error) {
      console.log(error)
    }
    setAccessToken(null)
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      {showNav && (
        <>
          {/* ===== MOBILE TOP HEADER (Minimal White Bar) ===== */}
          <header className="md:hidden sticky top-0 z-30 flex items-center justify-between bg-white/95 backdrop-blur-md px-4 py-3 border-b border-slate-200/80">
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <div>
                <span className="font-extrabold text-[15px] text-slate-900 tracking-tight block leading-none">
                  My Shop
                </span>
                
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 active:bg-red-100 text-red-600 rounded-xl border border-red-200/70 text-[12px] font-bold transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </header>

          {/* ===== DESKTOP SIDEBAR (Clean White) ===== */}
          <aside className="hidden md:flex md:sticky md:top-0 w-64 h-screen bg-white border-r border-slate-200/80 flex-col justify-between shrink-0 z-30">
            <div>
              {/* Brand */}
              <div className="px-5 py-5 border-b border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-[16px] font-extrabold text-slate-900 tracking-tight leading-none">
                    My Shop
                  </h1>
                  
                </div>
              </div>

              {/* Navigation */}
              <div className="px-3 py-5">
                <p className="px-3 text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-3">
                  Menu
                </p>
                <nav className="flex flex-col gap-1">
                  {/* 1. DASHBOARD */}
                  <Link
                    to="/dashboard"
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[14px] font-semibold transition-all ${
                      pathname === "/dashboard"
                        ? "bg-slate-900 text-white font-bold shadow-xs"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Home
                    </span>
                  </Link>

                  {/* 2. ADD STOCK */}
                  <Link
                    to="/addstock"
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[14px] font-semibold transition-all ${
                      pathname === "/addstock"
                        ? "bg-slate-900 text-white font-bold shadow-xs"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Stock
                    </span>
                  </Link>

                  {/* 3. EXPIRING SOON */}
                  <Link
                    to="/expiringsoon"
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[14px] font-semibold transition-all ${
                      pathname === "/expiringsoon"
                        ? "bg-slate-900 text-white font-bold shadow-xs"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Expiring
                    </span>
                  </Link>

                  {/* 4. UDHAR ENTRY */}
                  <Link
                    to="/addCustomer"
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[14px] font-semibold transition-all ${
                      pathname === "/addCustomer" || pathname === "/editCustomer"
                        ? "bg-slate-900 text-white font-bold shadow-xs"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      New Loan
                    </span>
                  </Link>

                  {/* 5. UDHAR LIST */}
                  <Link
                    to="/customerList"
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[14px] font-semibold transition-all ${
                      pathname === "/customerList"
                        ? "bg-slate-900 text-white font-bold shadow-xs"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Loan Record
                    </span>
                  </Link>
                </nav>
              </div>
            </div>

            {/* Desktop Logout */}
            <div className="p-3 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[14px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/60 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </aside>

          {/* ===== MOBILE BOTTOM NAVIGATION (Uber-style Floating Pill) ===== */}
          <nav className="md:hidden fixed bottom-4 left-4 right-4 z-40 max-w-sm mx-auto">
            <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-lg shadow-slate-900/10 rounded-full p-1.5 grid grid-cols-3 gap-1">
              {/* Tab 1: Home */}
              <Link
                to="/dashboard"
                className={`flex flex-col items-center justify-center py-2 rounded-full transition-all ${
                  isHomeTab
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={isHomeTab ? "2.3" : "1.9"} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-[11px] font-bold leading-none mt-1">Home</span>
              </Link>

              {/* Tab 2: Expiring */}
              <Link
                to="/expiringsoon"
                className={`flex flex-col items-center justify-center py-2 rounded-full transition-all ${
                  isExpiringTab
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={isExpiringTab ? "2.3" : "1.9"} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-[11px] font-bold leading-none mt-1">Expiring</span>
              </Link>

              {/* Tab 3: Udhar */}
              <Link
                to="/customerList"
                className={`flex flex-col items-center justify-center py-2 rounded-full transition-all ${
                  isUdharTab
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={isUdharTab ? "2.3" : "1.9"} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-[11px] font-bold leading-none mt-1">Loan</span>
              </Link>
            </div>
          </nav>
        </>
      )}

      {/* Main Content */}
      <main className={`flex-1 min-h-screen overflow-x-hidden bg-slate-50 ${showNav ? 'pb-24 md:pb-0' : ''}`}>
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
  )
}