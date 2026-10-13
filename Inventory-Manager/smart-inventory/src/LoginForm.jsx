import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
export default function LoginForm(){
    const[username,setUsername]=useState("")
    const[password,setPassword]=useState("")
    const navigate=useNavigate()
    const {setAccessToken}=useAuth()

    const handleLogin=async(e)=>{
        e.preventDefault()
        try{
            const response=await fetch('http://localhost:3000/api/auth/login',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({username,password}),
                credentials:'include'
            })
            const data=await response.json()
            if(data.success){
                setAccessToken(data.accessToken)
                alert("Login SuccessFull! Welcome Boss")
                navigate('/dashboard')
            }else{
                alert(data.message)
            }
        }catch(error){
            console.error("Login Crashed",error)
        }
    }

    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col gap-5 border border-slate-100" >
            <h1 className="text-3xl font-extrabold test-slate-8-0 text-center mb-2">Login</h1>
            <input className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-700" type="text" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)}/><br/>
            <input className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-700" type="text" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/><br/>
            <button  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors mt-4 shadow-sm">Secure Login</button>
            </form>
        </div>
     )
}