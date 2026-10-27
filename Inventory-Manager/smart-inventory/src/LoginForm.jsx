import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
export default function LoginForm() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const { setAccessToken } = useAuth()

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            })
            const data = await response.json()
            if (data.success) {
                setAccessToken(data.accessToken)
                alert("Login SuccessFull! Welcome Boss")
                navigate('/dashboard')
            } else {
                alert(data.message)
            }
        } catch (error) {
            console.error("Login Crashed", error)
        }
    }

    return (
  <div className="h-screen w-full bg-[#050b1a] text-white font-sans relative overflow-hidden flex items-center justify-between px-6 py-4 select-none">
    
    {/* Warehouse Background + Tailwind v4 Linear Gradient Overlay */}
    <div 
      className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity pointer-events-none"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop')" }}
    ></div>
    <div className="absolute inset-0 bg-linear-to-r from-[#050b1a] via-[#071128]/90 to-[#0b1a3a]/80 pointer-events-none"></div>
    
    {/* Ambient Glows */}
    <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 blur-[130px] pointer-events-none"></div>
    <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-500/15 blur-[130px] pointer-events-none"></div>

    {/* LEFT SECTION (60% Width): Dead Inventory Analytics */}
    <div className="relative z-10 w-7/12 h-full flex flex-col justify-between pr-4 py-1">
      
      {/* Top Logo & Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 border border-white/20">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div>
            <div className="text-base font-extrabold tracking-tight leading-none text-white">
              Smart Inventory <span className="text-[#00b4ff]">Manager</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Dead Inventory Analysis & Sorting</p>
          </div>
        </div>

        <div className="hidden xl:block border-l-2 border-cyan-400 pl-3 text-xs text-slate-300 font-medium">
          Turn Unused Stock into Better Decisions.
        </div>
      </div>

      {/* Main Content Grid: Hero Copy & Floating Cards */}
      <div className="grid grid-cols-12 gap-4 items-center my-auto">
        
        {/* Left Hero Text & 4 Points */}
        <div className="col-span-7 space-y-3">
          <div>
            <h1 className="text-2xl xl:text-3xl font-extrabold tracking-tight leading-tight text-white">
              Identify <span className="text-[#00b4ff]">Dead Inventory</span><br />
              Before It Becomes a Bigger Loss.
            </h1>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Analyze, track and automatically sort dead, slow-moving and inactive inventory with smart insights.
            </p>
          </div>

          {/* 4 Feature List */}
          <div className="space-y-2 pt-1">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-950/90 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">Dead Stock Detection</h4>
                <p className="text-[10px] text-slate-400 leading-tight">Find slow-moving items instantly.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-950/90 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 12 12 17 22 12"/><polyline points="2 17 12 22 22 17"/></svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">Smart Sorting</h4>
                <p className="text-[10px] text-slate-400 leading-tight">Auto-categorize by movement & age.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-950/90 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">Actionable Insights</h4>
                <p className="text-[10px] text-slate-400 leading-tight">Clear reports to reduce holding costs.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-950/90 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">Efficient Management</h4>
                <p className="text-[10px] text-slate-400 leading-tight">Keep inventory lean & profitable.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Floating Neon Cards */}
        <div className="col-span-5 space-y-2.5">
          
          {/* Card 1: Donut Status */}
          <div className="bg-[#0b1b3d]/90 backdrop-blur-xl border border-cyan-500/40 rounded-xl p-3 shadow-lg">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[11px] font-bold text-white">Inventory Status</span>
              <span className="text-[9px] text-cyan-400 font-semibold">Live Feed</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <svg className="w-12 h-12 shrink-0 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#1e293b" strokeWidth="4.5" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#10b981" strokeWidth="4.5" strokeDasharray="55 100" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="4.5" strokeDasharray="20 100" strokeDashoffset="-55" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#ef4444" strokeWidth="4.5" strokeDasharray="15 100" strokeDashoffset="-75" />
              </svg>
              <div className="text-[10px] space-y-0.5 flex-1">
                <div className="text-slate-400">Total: <span className="font-extrabold text-white">12,840</span></div>
                <div className="flex justify-between text-emerald-400"><span>● Active</span><span>8,642</span></div>
                <div className="flex justify-between text-amber-400"><span>● Slow</span><span>2,498</span></div>
                <div className="flex justify-between text-rose-500 font-bold"><span>● Dead</span><span>1,700</span></div>
              </div>
            </div>
          </div>

          {/* Card 2: Trend Chart */}
          <div className="bg-[#0b1b3d]/90 backdrop-blur-xl border border-rose-500/40 rounded-xl p-3 shadow-lg">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[11px] font-bold text-white">Dead Inventory Trend</span>
              <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">↑ 18.4%</span>
            </div>
            <div className="flex items-end justify-between h-9 gap-1 px-1">
              <div className="w-full h-3 bg-rose-500/40 rounded-t"></div>
              <div className="w-full h-4 bg-rose-500/50 rounded-t"></div>
              <div className="w-full h-5 bg-rose-500/60 rounded-t"></div>
              <div className="w-full h-6 bg-rose-500/80 rounded-t"></div>
              <div className="w-full h-7 bg-rose-500 rounded-t"></div>
              <div className="w-full h-9 bg-linear-to-t from-rose-600 to-orange-400 rounded-t"></div>
            </div>
          </div>

          {/* Card 3: Alert Box */}
          <div className="bg-linear-to-r from-rose-950/80 to-slate-900/90 backdrop-blur-xl border border-rose-500/50 rounded-xl p-2.5 shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-extrabold text-xs">
                !
              </div>
              <div>
                <p className="text-[10px] text-rose-200 leading-none">Dead Stock Items</p>
                <p className="text-sm font-extrabold text-white leading-tight mt-0.5">1,700</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[9px] font-extrabold tracking-wider">
              DEAD STOCK
            </span>
          </div>

        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="text-[10px] text-slate-500 flex items-center gap-4 font-medium">
        <span>● Real-time Cron Jobs Active</span>
        <span>● Automated Expiry Alerts</span>
      </div>

    </div>

    {/* RIGHT SECTION (40% Width): Perfectly Proportioned White Login Card */}
    <div className="relative z-20 w-5/12 max-w-sm bg-white text-slate-900 rounded-2xl p-5 shadow-2xl border border-slate-100 flex flex-col justify-between">
      
      <div>
        {/* Card Header Logo */}
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-md mb-1.5">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          </div>
          <h3 className="text-base font-extrabold text-slate-900 leading-tight">Smart Inventory</h3>
          <span className="text-xs font-extrabold text-blue-600 leading-tight">Manager</span>
        </div>

        <div className="text-center mb-4 border-t border-slate-100 pt-2.5">
          <h2 className="text-lg font-extrabold text-slate-900">Welcome Back!</h2>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">Sign in to access your inventory dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input 
                type="text" 
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input 
                type="password" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-3 h-3 rounded text-blue-600" />
              Remember me
            </label>
            <span className="text-blue-600 font-bold hover:underline cursor-pointer">Forgot password?</span>
          </div>

          <button 
            type="submit" 
            className="w-full py-2.5 bg-linear-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1"
          >
            <span>Secure Login</span>
            <span>→</span>
          </button>
        </form>

        {/* Signup Link */}
        <div className="mt-3 text-center">
          <p className="text-[11px] text-slate-600 font-medium">
            Don't have an account?{" "}
            <span className="text-blue-600 font-extrabold hover:underline cursor-pointer">
              Sign up
            </span>
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="border-t border-slate-100 pt-2 mt-3 text-center">
        <p className="text-[10px] font-bold text-slate-500">Smart Inventory Manager</p>
        <p className="text-[9px] text-slate-400">Dead Inventory Analysis & Sorting</p>
      </div>

    </div>

  </div>
)

}