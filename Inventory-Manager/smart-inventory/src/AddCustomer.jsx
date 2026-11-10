import { useState } from "react";
import { useNavigate,useLocation} from "react-router-dom";
import { useAuth } from "./AuthContext";
const API='http://localhost:3000/api/inventory/customers'

export default function AddCustomer(){
    const {authFetch}=useAuth()
    const navigate=useNavigate()
    const editData=useLocation().state?.customer
    const [form,setForm]=useState(
        editData
        ?{name:editData.name,totalAmount:editData.totalAmount,address:editData.address,phone:editData.phone}
        :{name:'',totalAmount:'',address:'',phone:''})
    const[saving,setSaving]=useState(false)
    const[msg,setMsg]=useState('')

    const handleChange=(e)=>{
        setForm({...form,[e.target.name]:e.target.value})
    }

   const handleSubmit = async (e) => {
  e.preventDefault()
  if (saving) return
  setSaving(true)
  setMsg('')
  try {
    const url = editData ? `${API}/${editData._id}` : API
    const res = await authFetch(url, {
      method: editData ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (!res.ok) {
      setMsg(data.message || data.error || 'Save nahi hua')
      return
    }
    navigate('/customerList')
  } catch (error) {
    setMsg('Server se connect nahi hua')
  } finally {
    setSaving(false)
  }
}
    return (
  <div className="flex min-h-screen items-center justify-center bg-[#060b19] p-4 text-slate-100 md:p-10">
    {/* Main Telemetry Card */}
    <div className="w-full max-w-lg rounded-2xl border border-cyan-500/20 bg-[#0a1124]/90 p-6 shadow-[0_0_50px_-12px_rgba(6,182,212,0.15)] backdrop-blur-md sm:p-8">
      
      {/* Header Section (Exact match to "Initialize New Stock") */}
      <div className="mb-8 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
          <span className=" font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Money Recover Mode
          </span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
         {editData? 'Update Udhar Entry':'Initialize Udhar Entry'}
        </h1>
        <p className="mt-1.5 font-mono text-[11px] uppercase tracking-widest text-slate-400">
          Enter Customer Metadata & Automated Recovery Trigger
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Customer Name */}
        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-200">
            Customer Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="e.g. Rajesh Sharma"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-800 bg-[#060a17] px-4 py-3.5 font-mono text-sm text-cyan-50 placeholder-slate-600 transition-all focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
          />
        </div>

        {/* 2-Column Grid on Desktop, Stacked on Mobile */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Total Udhaar Amount */}
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-200">
              Total Udhar (₹)
            </label>
            <input
              name="totalAmount"
              type="number"
              placeholder="e.g. 1500"
              value={form.totalAmount}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-800 bg-[#060a17] px-4 py-3.5 font-mono text-sm text-cyan-50 placeholder-slate-600 transition-all focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
            />
          </div>

          {/* WhatsApp Phone Number */}
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-200">
              WhatsApp Number
            </label>
            <input
              name="phone"
              type="tel"
              placeholder="e.g. 9876543210"
              value={form.phone}
              onChange={handleChange}
              maxLength={10}
              required
              className="w-full rounded-xl border border-slate-800 bg-[#060a17] px-4 py-3.5 font-mono text-sm text-cyan-50 placeholder-slate-600 transition-all focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-200">
            Location / Address
          </label>
          <input
            name="address"
            type="text"
            placeholder="e.g. Shop No. 4, Main Market"
            value={form.address}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-800 bg-[#060a17] px-4 py-3.5 font-mono text-sm text-cyan-50 placeholder-slate-600 transition-all focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
          />
        </div>

        {/* Error / Status Message */}
        {msg && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center font-mono text-xs text-red-400">
            ● {msg}
          </div>
        )}

        {/* Glowing Cyan Submit Button */}
        <button
          type="submit"
          disabled={saving}
          className="mt-2 w-full rounded-xl bg-linear-to-r from-cyan-400 to-sky-500 px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.15em] text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all hover:from-cyan-300 hover:to-sky-400 hover:shadow-[0_0_35px_rgba(6,182,212,0.65)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
         {editData
         ?(saving ? '⚡ Syncing With Ledger...' : 'Update Entry')
         :(saving ? '⚡ Syncing With Ledger...' : '+ Add Entry')}
        </button>

      </form>
    </div>
  </div>
)

}