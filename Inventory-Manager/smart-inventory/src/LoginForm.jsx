import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import ForgotPassword from "./ForgotPassword";
import { API_URL } from "./config";

export default function LoginForm() {
    const [isLoginView, setIsLoginView] = useState(true);
    const [isForgotView, setIsForgotView] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isLogin, setIsLogin] = useState(false);

    // --- LOGIN KE ALAG STATE ---
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // --- SIGNUP KE ALAG STATE ---
    const [signupUsername, setSignupUsername] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");

    const navigate = useNavigate();
    const { setAccessToken } = useAuth();

    const switchToLogin = () => {
        setSignupUsername("");
        setSignupPassword("");
        setName("");
        setEmail("");
        setOtp("");
        setIsOtpSent(false);
        setLoginUsername("");
        setLoginPassword("");
        setShowPassword(false);
        setIsLoginView(true);
    };

    const switchToSignup = () => {
        setLoginUsername("");
        setLoginPassword("");
        setShowPassword(false);
        setIsLoginView(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (isLogin) return;
        setIsLogin(true);
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: loginUsername, password: loginPassword }),
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setAccessToken(data.accessToken);
                alert("Login SuccessFull! Welcome Boss");
                setLoginUsername("");
                setLoginPassword("");
                navigate('/dashboard');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Login Crashed", error);
        } finally {
            setIsLogin(false);
        }
    };

    const handleGetOtp = async () => {
        if (!email) {
            alert("Pehle email daalo bhai!");
            return;
        }
        setIsSendingOtp(true);
        try {
            const response = await fetch(`${API_URL}/api/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                alert("OTP Bhej diya bhai teri email par!");
                setIsOtpSent(true);
            } else {
                alert(data.error || "OTP bhejne mein issue aaya");
            }
        } catch (error) {
            console.error("OTP Error:", error);
            alert("Server se connect nahi ho paya");
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (isSignUp) return;
        setIsSignUp(true);
        try {
            const response = await fetch(`${API_URL}/api/auth/signUp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: signupUsername, password: signupPassword, name, email, otp }),
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                alert("Signup SuccessFully Please Login");
                setSignupUsername("");
                setSignupPassword("");
                setName("");
                setEmail("");
                setOtp("");
                setIsOtpSent(false);
                setLoginUsername("");
                setLoginPassword("");
                setShowPassword(false);
                setIsLoginView(true);
            } else {
                alert(data.error || data.message);
            }
        } catch (error) {
            console.error("Signup Crashed", error);
        } finally {
            setIsSignUp(false);
        }
    };

    return (
        <div className="min-h-screen lg:h-screen w-full bg-white lg:bg-[#050b1a] text-slate-900 lg:text-white font-sans relative overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row items-center justify-center lg:justify-between px-5 sm:px-6 lg:px-8 xl:px-14 pt-8 pb-6 lg:py-4 gap-6 select-none">

            <div
                className="hidden lg:block absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity pointer-events-none"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop')" }}
            ></div>
            <div className="hidden lg:block absolute inset-0 bg-linear-to-r from-[#050b1a] via-[#071128]/90 to-[#0b1a3a]/80 pointer-events-none"></div>

            <div className="hidden lg:block absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 blur-3xl pointer-events-none"></div>
            <div className="hidden lg:block absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-500/15 blur-3xl pointer-events-none"></div>

            <div className="relative z-10 w-full lg:flex-1 lg:h-full flex flex-col justify-center lg:justify-between lg:pr-4 py-1">

                <div className="flex lg:hidden flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-md shrink-0">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                            <line x1="12" y1="22.08" x2="12" y2="12" />
                        </svg>
                    </div>
                    <div className="mt-3">
                        <div className="text-2xl font-extrabold tracking-tight leading-none text-slate-900">
                            Smart Inventory <span className="text-blue-600">Manager</span>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 border border-white/20 shrink-0">
                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                <line x1="12" y1="22.08" x2="12" y2="12" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-lg font-extrabold tracking-tight leading-none text-white">
                                Smart Inventory <span className="text-[#00b4ff]">Manager</span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5">Dukaan ka Stock + Udhar</p>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:grid lg:grid-cols-12 gap-4 xl:gap-6 items-center my-auto">
                    <div className="lg:col-span-7 space-y-3.5">
                        <div>
                            <h1 className="text-xl lg:text-2xl xl:text-3xl font-extrabold tracking-tight leading-tight text-white">
                                Maal Kharab Hone Se<br />
                                <span className="text-[#00b4ff]">Pehle Pata Chalega.</span>
                            </h1>
                            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                                Kaunsa maal expire hone wala hai, kaunsa slow bik raha hai, aur kisne kitna udhar liya hai - sab ek jagah.
                            </p>
                        </div>

                        <div className="space-y-2.5 pt-1">
                            <div className="flex items-start gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-blue-950/90 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white leading-tight">Expire Se Pehle Alert</h4>
                                    <p className="text-[10px] text-slate-400 leading-tight">Maal kharab hone se pehle bech do.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-blue-950/90 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 12 12 17 22 12" /><polyline points="2 17 12 22 22 17" /></svg>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white leading-tight">Udhar Ka Hisaab</h4>
                                    <p className="text-[10px] text-slate-400 leading-tight">Kisne kitna liya, kab dega - sab likha rahega.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-blue-950/90 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white leading-tight">Aasan Hisaab</h4>
                                    <p className="text-[10px] text-slate-400 leading-tight">Bina copy-kitaab ke, phone se hi sab pata chalega.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-blue-950/90 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white leading-tight">Stock Smart Rakho</h4>
                                    <p className="text-[10px] text-slate-400 leading-tight">Dukaan ka maal lean aur profit zyada.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 space-y-2.5">
                        <div className="bg-[#0b1b3d]/90 backdrop-blur-xl border border-cyan-500/40 rounded-xl p-3 shadow-lg">
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[11px] font-bold text-white">Dukaan ka Stock</span>
                                <span className="text-[9px] text-cyan-400 font-semibold">Live</span>
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
                                    <div className="flex justify-between text-emerald-400"><span>● Chal Raha</span><span>8,642</span></div>
                                    <div className="flex justify-between text-amber-400"><span>● Slow</span><span>2,498</span></div>
                                    <div className="flex justify-between text-rose-500 font-bold"><span>● Expire Wala</span><span>1,700</span></div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#0b1b3d]/90 backdrop-blur-xl border border-rose-500/40 rounded-xl p-3 shadow-lg">
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[11px] font-bold text-white">Expire Wala Maal</span>
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
                        <div className="bg-linear-to-r from-rose-950/80 to-slate-900/90 backdrop-blur-xl border border-rose-500/50 rounded-xl p-2.5 shadow-lg flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-extrabold text-xs">!</div>
                                <div>
                                    <p className="text-[10px] text-rose-200 leading-none">Expire Hone Wala Maal</p>
                                    <p className="text-sm font-extrabold text-white leading-tight mt-0.5">1,700</p>
                                </div>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[9px] font-extrabold tracking-wider">EXPIRE WALA</span>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex text-[10px] text-slate-400 items-center gap-4 font-medium">
                    <span>● Stock Alert On Hai</span>
                    <span>● Expire Se Pehle Yaad Dilayega</span>
                </div>
            </div>

            {isForgotView ? (
                <div className="relative z-20 w-full max-w-md lg:w-85 shrink-0 mx-auto lg:mx-0">
                    <ForgotPassword onBack={() => setIsForgotView(false)} />
                </div>
            ) : (
                <div className="relative z-20 w-full max-w-md lg:w-85 shrink-0 mx-auto lg:mx-0 bg-white text-slate-900 rounded-none lg:rounded-2xl p-0 lg:p-5 shadow-none lg:shadow-2xl border-0 lg:border lg:border-slate-100 flex flex-col justify-between">

                    <div>
                        <div className="hidden lg:flex flex-col items-center text-center mb-2">
                            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-md mb-1">
                                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                </svg>
                            </div>
                            <h3 className="text-[13px] font-extrabold text-slate-900 leading-tight">Smart Inventory</h3>
                            <span className="text-[11px] font-extrabold text-blue-600 leading-tight">Manager</span>
                        </div>

                        {isLoginView ? (
                            <>
                                <div className="text-center mb-5 lg:mb-3.5 lg:border-t lg:border-slate-100 lg:pt-2">
                                    <h2 className="text-xl lg:text-lg font-extrabold text-slate-900">Welcome Back!</h2>
                                    <p className="text-xs lg:text-[11px] text-slate-500 font-medium mt-0.5">Sign in to access your inventory dashboard</p>
                                </div>

                                <form key="login-form" onSubmit={handleLogin} autoComplete="off" className="space-y-4 lg:space-y-3">
                                    <div>
                                        <label className="block text-xs lg:text-[11px] font-bold text-slate-700 mb-1.5 lg:mb-1">Username</label>
                                        <input
                                            type="text"
                                            placeholder="Enter your username"
                                            value={loginUsername}
                                            onChange={(e) => setLoginUsername(e.target.value)}
                                            autoComplete="off"
                                            className="w-full px-3.5 py-3 lg:px-3 lg:py-2 bg-slate-50 border border-slate-200 rounded-xl text-base lg:text-xs text-slate-800 font-medium focus:outline-none focus:border-slate-900 lg:focus:border-blue-600 focus:ring-2 focus:ring-slate-200 lg:focus:ring-blue-100 focus:bg-white transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs lg:text-[11px] font-bold text-slate-700 mb-1.5 lg:mb-1">Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter your password"
                                                value={loginPassword}
                                                onChange={(e) => setLoginPassword(e.target.value)}
                                                autoComplete="new-password"
                                                className="w-full px-3.5 py-3 lg:px-3 lg:py-2 pr-11 lg:pr-10 bg-slate-50 border border-slate-200 rounded-xl text-base lg:text-xs text-slate-800 font-medium focus:outline-none focus:border-slate-900 lg:focus:border-blue-600 focus:ring-2 focus:ring-slate-200 lg:focus:ring-blue-100 focus:bg-white transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3.5 lg:right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 lg:hover:text-blue-600 focus:outline-none cursor-pointer"
                                            >
                                                {showPassword ? (
                                                    <svg className="w-5 h-5 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                ) : (
                                                    <svg className="w-5 h-5 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs lg:text-[11px] pt-0.5">
                                        <label className="flex items-center gap-2 lg:gap-1.5 font-semibold text-slate-700 cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 lg:w-3.5 lg:h-3.5 rounded text-blue-600" />
                                            Remember me
                                        </label>
                                        <span
                                            onClick={() => setIsForgotView(true)}
                                            className="text-blue-600 font-bold hover:underline cursor-pointer"
                                        >
                                            Forgot password?
                                        </span>
                                    </div>

                                    <button type="submit" disabled={isLogin} className="w-full py-3.5 lg:py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm lg:text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2 disabled:opacity-50">
                                        <span>{isLogin ? "Logging in..." : "Secure Login"}</span><span>→</span>
                                    </button>
                                </form>

                                <div className="mt-5 lg:mt-3.5 text-center">
                                    <p className="text-xs lg:text-[11px] text-slate-600 font-medium">
                                        Don't have an account?{" "}
                                        <span onClick={switchToSignup} className="text-blue-600 font-extrabold hover:underline cursor-pointer">
                                            Sign up
                                        </span>
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-center mb-4 lg:mb-2.5 lg:border-t lg:border-slate-100 lg:pt-2">
                                    <h2 className="text-xl lg:text-[16px] font-extrabold text-slate-900">Create Account</h2>
                                    <p className="text-xs lg:text-[10px] text-slate-500 font-medium mt-0.5">Join to manage your inventory smarter</p>
                                </div>

                                <form key="signup-form" onSubmit={handleSignup} autoComplete="off" className="space-y-3 lg:space-y-2">
                                    <div>
                                        <label className="block text-xs lg:text-[10px] font-bold text-slate-700 mb-1 lg:mb-0.5">Full Name</label>
                                        <input
                                            type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} autoComplete="off"
                                            className="w-full px-3.5 py-2.5 lg:px-3 lg:py-1.5 bg-slate-50 border border-slate-200 rounded-xl lg:rounded-lg text-base lg:text-xs text-slate-800 font-medium focus:outline-none focus:border-slate-900 lg:focus:border-blue-600 focus:bg-white transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs lg:text-[10px] font-bold text-slate-700 mb-1 lg:mb-0.5">Username</label>
                                        <input
                                            type="text" placeholder="johndoe123" value={signupUsername} onChange={(e) => setSignupUsername(e.target.value)} autoComplete="off"
                                            className="w-full px-3.5 py-2.5 lg:px-3 lg:py-1.5 bg-slate-50 border border-slate-200 rounded-xl lg:rounded-lg text-base lg:text-xs text-slate-800 font-medium focus:outline-none focus:border-slate-900 lg:focus:border-blue-600 focus:bg-white transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs lg:text-[10px] font-bold text-slate-700 mb-1 lg:mb-0.5">Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Create strong password"
                                                value={signupPassword}
                                                onChange={(e) => setSignupPassword(e.target.value)}
                                                autoComplete="new-password"
                                                className="w-full px-3.5 py-2.5 lg:px-3 lg:py-1.5 pr-11 lg:pr-10 bg-slate-50 border border-slate-200 rounded-xl lg:rounded-lg text-base lg:text-xs text-slate-800 font-medium focus:outline-none focus:border-slate-900 lg:focus:border-blue-600 focus:bg-white transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3.5 lg:right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 lg:hover:text-blue-600 focus:outline-none cursor-pointer"
                                            >
                                                {showPassword ? (
                                                    <svg className="w-5 h-5 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                ) : (
                                                    <svg className="w-5 h-5 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs lg:text-[10px] font-bold text-slate-700 mb-1 lg:mb-0.5">Email Address</label>
                                        <div className="flex gap-2 lg:gap-1.5">
                                            <input
                                                type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                                                disabled={isOtpSent} autoComplete="off"
                                                className="w-2/3 px-3.5 py-2.5 lg:px-3 lg:py-1.5 bg-slate-50 border border-slate-200 rounded-xl lg:rounded-lg text-base lg:text-xs text-slate-800 font-medium focus:outline-none focus:border-slate-900 lg:focus:border-blue-600 focus:bg-white transition-all disabled:opacity-50"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleGetOtp}
                                                disabled={isSendingOtp}
                                                className="w-1/3 py-2.5 lg:py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-extrabold text-xs lg:text-[10px] rounded-xl lg:rounded-lg border border-blue-200 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                                            >
                                                {isSendingOtp ? "Sending..." : (isOtpSent ? "Resend" : "Send OTP")}
                                            </button>
                                        </div>
                                    </div>

                                    {isOtpSent && (
                                        <>
                                            <div>
                                                <label className="block text-xs lg:text-[10px] font-bold text-slate-700 mb-1 lg:mb-0.5 mt-2">Verify OTP</label>
                                                <input
                                                    type="text" placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} autoComplete="off"
                                                    className="w-full px-3.5 py-2.5 lg:px-3 lg:py-1.5 bg-slate-50 border border-slate-200 rounded-xl lg:rounded-lg text-base lg:text-xs text-slate-800 font-bold tracking-widest focus:outline-none focus:border-slate-900 lg:focus:border-blue-600 focus:bg-white transition-all"
                                                />
                                            </div>

                                            <button type="submit" disabled={isSignUp} className="w-full py-3.5 lg:py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm lg:text-xs rounded-xl shadow-sm transition-all cursor-pointer mt-2 disabled:opacity-50">
                                                {isSignUp ? "Creating..." : "Create Account →"}
                                            </button>
                                        </>
                                    )}
                                </form>

                                <div className="mt-4 lg:mt-2.5 text-center">
                                    <p className="text-xs lg:text-[11px] text-slate-600 font-medium">
                                        Already have an account?{" "}
                                        <span onClick={switchToLogin} className="text-blue-600 font-extrabold hover:underline cursor-pointer">
                                            Login
                                        </span>
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="hidden lg:block border-t border-slate-100 pt-2.5 mt-3 text-center">
                        <p className="text-[10px] font-bold text-slate-500">Smart Inventory Manager</p>
                        <p className="text-[9px] text-slate-400">Dukaan ka Stock + Udhar</p>
                    </div>
                </div>
            )}
        </div>
    );
}