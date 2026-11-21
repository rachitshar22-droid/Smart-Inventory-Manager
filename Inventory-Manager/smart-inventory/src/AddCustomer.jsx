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
  <div className="flex min-h-screen items-center justify-center bg-[#0A0F1E] p-3 text-white">
    <div className="w-full max-w-md rounded-xl border border-slate-800 bg-[#121A2E] p-4 sm:p-5">
      
      {/* Header - Chhota */}
      <div className="mb-4 text-center">
        <p className="text-[10px] font-bold tracking-widest text-amber-400">DUKAAN • UDHAR KHATA</p>
        <h1 className="text-[19px] font-extrabold tracking-tight leading-tight mt-1">
          {editData ? 'Udhar Update Karo' : 'Naya Udhar Likho'}
        </h1>
        <p className="mt-0.5 text-[11px] text-slate-400">
          {editData ? 'Customer ka paisa ya detail badal raha hai.' : 'Naam, paisa aur number daalo, khata ban jayega.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        
        {/* Customer Name */}
        <div>
          <label className="mb-1 block text-[11px] font-semibold text-slate-200">
            Customer ka Naam
          </label>
          <input
            name="name"
            type="text"
            placeholder="e.g. Rajesh Sharma"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-700 bg-[#0A0F1E] px-3 py-2.5 text-[13px] text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Amount */}
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-slate-200">
              Kitna Udhar Diya? (₹)
            </label>
            <input
              name="totalAmount"
              type="number"
              placeholder="e.g. 1500"
              value={form.totalAmount}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-700 bg-[#0A0F1E] px-3 py-2.5 text-[13px] text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-slate-200">
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
              className="w-full rounded-lg border border-slate-700 bg-[#0A0F1E] px-3 py-2.5 text-[13px] text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="mb-1 block text-[11px] font-semibold text-slate-200">
            Kaha Rehta Hai? / Mohalla
          </label>
          <input
            name="address"
            type="text"
            placeholder="e.g. Main Market, Firozabad"
            value={form.address}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-700 bg-[#0A0F1E] px-3 py-2.5 text-[13px] text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
          />
        </div>

        {msg && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-center text-[11px] font-medium text-red-300">
            {msg}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-amber-400 hover:bg-amber-300 px-4 py-2.5 text-[13px] font-bold text-black transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {editData
            ? (saving ? 'Save ho raha hai...' : 'Update Karo')
            : (saving ? 'Save ho raha hai...' : '+ Udhar Khate Me Likho')}
        </button>

        <p className="text-center text-[10px] text-slate-500 pt-0.5">
          Save karte hi ye Udhar Khate me dikhne lagega.
        </p>

      </form>
    </div>
  </div>
)
}