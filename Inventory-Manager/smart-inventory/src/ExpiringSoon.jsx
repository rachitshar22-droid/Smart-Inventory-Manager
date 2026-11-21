import { useState, useEffect } from "react"
import { useAuth } from "./AuthContext"

export default function ExpiringSoon() {
    const { authFetch } = useAuth()
    const [inventory, setInventory] = useState([])

    useEffect(() => {
        const fetchExpiryItems = async () => {
            try {
                const response = await authFetch('http://localhost:3000/api/inventory', {})
                if (!response.ok) {
                    console.log('Fetch failed:', response.status)
                    return
                }
                const data = await response.json()
                if (data.success) {
                    setInventory(data.data.filter((item) => item.daysRemaining <= 30))
                }
            } catch (error) {
                console.log("Error aagya Bhai:", error)
            }
        }
        fetchExpiryItems()
    }, [])

    const deadCount = inventory.filter(i => i.daysRemaining < 0).length
    const criticalCount = inventory.filter(i => i.daysRemaining >= 0 && i.daysRemaining <= 3).length

    return (
        <div className="min-h-screen bg-[#0A0F1E] p-4 sm:p-6 text-white">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 mb-5 border-b border-slate-800">
                    <div>
                        <p className="text-[12px] font-bold tracking-widest text-amber-400">DUKAAN • STOCK</p>
                        <h1 className="text-[28px] sm:text-[32px] font-extrabold tracking-tight leading-none mt-1">
                            Khatam Hone Wala Maal
                        </h1>
                        <p className="text-[13px] text-slate-400 mt-1.5">Jo maal expire hone wala hai ya ho gaya hai, pehle isko niptao.</p>
                    </div>

                    {/* Pills */}
                    <div className="flex items-center gap-2.5">
                        <div className="bg-[#1A150A] border border-amber-500/40 px-4 py-2.5 rounded-xl flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                            <span className="text-[12px] font-semibold text-slate-300">Expire Hone Wala:</span>
                            <span className="text-[15px] font-extrabold text-amber-400">{criticalCount}</span>
                        </div>
                        <div className="bg-[#1A0F0F] border border-red-500/40 px-4 py-2.5 rounded-xl flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            <span className="text-[12px] font-semibold text-slate-300">Expire Ho Gaya:</span>
                            <span className="text-[15px] font-extrabold text-red-400">{deadCount}</span>
                        </div>
                    </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {inventory.length === 0 ? (
                        <div className="col-span-full bg-[#121A2E] border border-slate-800 p-10 rounded-2xl text-center">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3 text-xl font-bold">
                                ✓
                            </div>
                            <p className="text-[15px] font-bold text-white">
                                Sab Theek Hai!
                            </p>
                            <p className="text-[13px] text-slate-400 mt-1">
                                Bhai sab theek hai, koi saman kharab hone wala nahi hai abhi. Chill kar.
                            </p>
                        </div>
                    ) : (
                        inventory.map((item) => {
                            const isDead = item.daysRemaining < 0

                            return (
                                <div
                                    key={item._id}
                                    className={`bg-[#121A2E] rounded-2xl p-4 border flex flex-col justify-between gap-4 ${
                                        isDead
                                            ? "border-red-500/40 border-t-4 border-t-red-500"
                                            : "border-amber-500/40 border-t-4 border-t-amber-400"
                                    }`}
                                >
                                    <div>
                                        {/* Top Row */}
                                        <div className="flex items-center justify-between gap-2 mb-3">
                                            <span className="text-[11px] font-bold uppercase tracking-wide bg-slate-800 text-slate-200 px-2.5 py-1 rounded-full">
                                                {item.category || "General"}
                                            </span>

                                            <span
                                                className={`text-[12px] font-bold px-2.5 py-1 rounded-full ${
                                                    isDead
                                                        ? "bg-red-500/15 text-red-400"
                                                        : "bg-amber-400/15 text-amber-300"
                                                }`}
                                            >
                                                {isDead
                                                    ? `Expire hua • ${Math.abs(item.daysRemaining)} din pehle`
                                                    : `${item.daysRemaining} din bache`}
                                            </span>
                                        </div>

                                        {/* Product Title */}
                                        <h2 className="text-[17px] font-bold text-white leading-snug">
                                            {item.productName}
                                        </h2>

                                        {/* Details Box */}
                                        <div className="mt-3 bg-[#0A0F1E] border border-slate-800 rounded-xl p-3 space-y-2 text-[13px]">
                                            {item.batchNo && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[12px] text-slate-400">Batch No.</span>
                                                    <span className="text-white font-bold">#{item.batchNo}</span>
                                                </div>
                                            )}
                                            {item.expiryDate && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[12px] text-slate-400">Expiry Date</span>
                                                    <span className={`font-bold ${isDead ? "text-red-400" : "text-amber-300"}`}>
                                                        {item.expiryDate.split('T')[0].split('-').reverse().join('-')}
                                                    </span>
                                                </div>
                                            )}
                                            {item.quantity !== undefined && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[12px] text-slate-400">Kitna Bacha Hai</span>
                                                    <span className="text-emerald-400 font-bold">{item.quantity} Piece</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[12px]">
                                        <span className="text-slate-400">Status</span>
                                        <span
                                            className={`font-bold px-2.5 py-1 rounded-full ${
                                                isDead
                                                    ? "bg-red-500/15 text-red-400"
                                                    : "bg-amber-400/15 text-amber-300"
                                            }`}
                                        >
                                            {isDead ? "Expire Ho Gaya" : "Jaldi Becho"}
                                        </span>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}