import { useState } from 'react'

const API = 'http://localhost:3000/api/auth/forgot'

export default function ForgotPassword({ onBack }) {
  const [step, setStep] = useState('email')   // email -> otp -> reset
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false) // Eye button state
  const [busy, setBusy] = useState(false)   // ye "state lock" hai
  const [msg, setMsg] = useState('')

  const post = async (path, body) => {
    const res = await fetch(`${API}/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    return res.json()
  }

  const sendOtp = async () => {
    if (busy) return
    setBusy(true); setMsg('')
    try {
      const data = await post('send-otp', { email })
      setMsg(data.message || data.error)
      if (data.success) setStep('otp')
    } catch { setMsg('Server se connect nahi hua') }
    finally { setBusy(false) }
  }

  const verifyOtp = async () => {
    if (busy) return
    setBusy(true); setMsg('')
    try {
      const data = await post('verify-otp', { email, otp })
      if (data.success) { setResetToken(data.resetToken); setStep('reset'); setMsg('') }
      else setMsg(data.message || data.error)
    } catch { setMsg('Server se connect nahi hua') }
    finally { setBusy(false) }
  }

  const resetPassword = async () => {
    if (busy) return
    if (newPassword !== confirmPassword) return setMsg('Password match nahi karte')
    setBusy(true); setMsg('')
    try {
      const data = await post('reset', { resetToken, newPassword, confirmPassword })
      if (data.success) { alert('Password update ho gaya, ab login kar'); onBack() }
      else setMsg(data.message || data.error)
    } catch { setMsg('Server se connect nahi hua') }
    finally { setBusy(false) }
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md mx-auto text-slate-800 border border-slate-100">
      
      {/* Top Brand Logo & Title */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-2 shadow-md shadow-blue-500/20">
          <div className="w-5 h-5 border-2 border-white rounded-full"></div>
        </div>
        <div className="text-center leading-tight">
          <p className="font-bold text-slate-900 text-sm">Smart Inventory</p>
          <p className="font-bold text-blue-600 text-xs">Manager</p>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 mt-4">
          {step === 'email' && 'Reset Password'}
          {step === 'otp' && 'Verify OTP'}
          {step === 'reset' && 'Create New Password'}
        </h2>
        <p className="text-xs text-slate-500 mt-1 text-center">
          {step === 'email' && 'Enter your registered email to receive a 6-digit OTP'}
          {step === 'otp' && `Enter the OTP sent to ${email}`}
          {step === 'reset' && 'Strong password banana: Min 8 chars, 1 capital, 1 number'}
        </p>
      </div>

      <div className="space-y-4">
        
        {/* STEP 1: EMAIL */}
        {step === 'email' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>
            <button
              disabled={busy || !email}
              onClick={sendOtp}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-full shadow-lg shadow-blue-500/30 transition-all text-sm cursor-pointer"
            >
              {busy ? 'Bhej raha hu...' : 'Send OTP →'}
            </button>
          </div>
        )}

        {/* STEP 2: OTP */}
        {step === 'otp' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">6-Digit OTP</label>
              <input
                maxLength={6}
                placeholder="• • • • • •"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-center tracking-[0.5em] font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>
            <button
              disabled={busy || otp.length !== 6}
              onClick={verifyOtp}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-full shadow-lg shadow-blue-500/30 transition-all text-sm cursor-pointer"
            >
              {busy ? 'Checking...' : 'Verify OTP →'}
            </button>
          </div>
        )}

        {/* STEP 3: NEW PASSWORD (WITH EYE ICON) */}
        {step === 'reset' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 focus:outline-none cursor-pointer"
                >
                  {showPass ? (
                    /* Khuli hui Aankh */
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  ) : (
                    /* Band Aankh */
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 focus:outline-none cursor-pointer"
                >
                  {showPass ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  )}
                </button>
              </div>
            </div>

            <button
              disabled={busy || !newPassword || !confirmPassword}
              onClick={resetPassword}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-full shadow-lg shadow-blue-500/30 transition-all text-sm cursor-pointer"
            >
              {busy ? 'Updating...' : 'Update Password →'}
            </button>
          </div>
        )}

        {/* Error / Status Message Box */}
        {msg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-center">
            <p className="text-xs font-semibold text-red-600">{msg}</p>
          </div>
        )}

        {/* Back to Login Button */}
        <div className="pt-2 text-center border-t border-slate-100">
          <button
            onClick={onBack}
            className="text-xs text-slate-500 hover:text-blue-600 font-semibold transition-colors cursor-pointer"
          >
            Remember your password? <span className="text-blue-600 underline">Back to Login</span>
          </button>
        </div>

        {/* Footer Text */}
        <div className="text-center pt-1">
          <p className="text-[11px] font-semibold text-slate-400">Smart Inventory Manager</p>
          <p className="text-[10px] text-slate-300">Dead Inventory Analysis & Sorting</p>
        </div>

      </div>
    </div>
  )
}