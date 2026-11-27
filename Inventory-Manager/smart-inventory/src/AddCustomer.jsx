import { useState } from "react";
import { API_URL } from "./config";
import { useNavigate,useLocation} from "react-router-dom";
import { useAuth } from "./AuthContext";
const API=`${API_URL}/api/inventory/customers`

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
    <div className="min-h-screen bg-white sm:bg-slate-50 px-4 py-5 sm:py-8 text-slate-900">
      <div className="w-full max-w-xl mx-auto sm:bg-white sm:border sm:border-slate-200/80 sm:p-7 sm:rounded-2xl sm:shadow-sm">
        
        {/* Header - Left aligned, clean */}
        <div className="mb-6">
          
          <h1 className="text-[26px] sm:text-[28px] font-extrabold tracking-tight leading-tight text-slate-900 mt-1">
            {editData ? 'Update the outstanding balance' : 'Record a new loan!'}
          </h1>
          <p className="mt-1 text-[13px] text-slate-500 font-medium">
            {editData
              ? 'The record is being updated.'
              : 'Enter the details and a record will be created'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Customer Name */}
          <div>
            <label className="mb-1.5 block text-[12px] font-bold text-slate-700">
              Customer Name
            </label>
            <input
              name="name"
              type="text"
              placeholder="e.g. Rajesh Sharma"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-base sm:text-[14px] font-medium text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Amount */}
            <div className="min-w-0">
              <label className="mb-1.5 block text-[12px] font-bold text-slate-700">
                How much was lent?
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] font-bold text-slate-500">
                  ₹
                </span>
                <input
                  name="totalAmount"
                  type="number"
                  inputMode="numeric"
                  placeholder="1500"
                  value={form.totalAmount}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3.5 py-3 text-base sm:text-[14px] font-bold text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="min-w-0">
              <label className="mb-1.5 block text-[12px] font-bold text-slate-700">
                WhatsApp Number
              </label>
              <input
                name="phone"
                type="tel"
                inputMode="tel"
                placeholder="98765..."
                value={form.phone}
                onChange={handleChange}
                maxLength={10}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-base sm:text-[14px] font-medium text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="mb-1.5 block text-[12px] font-bold text-slate-700">
              Address
            </label>
            <input
              name="address"
              type="text"
              placeholder="e.g. Main Market, Firozabad"
              value={form.address}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-base sm:text-[14px] font-medium text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
            />
          </div>

          {msg && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-center text-[12px] font-semibold text-red-600">
              {msg}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-3.5 text-[15px] font-bold text-white shadow-sm transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
          >
            {editData
              ? (saving ? 'Save ho raha hai...' : 'Update it')
              : (saving ? 'Save ho raha hai...' : '+ Record it in the credit account')}
          </button>

          

        </form>
      </div>
    </div>
  )
}