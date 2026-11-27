import { createContext,useState,useEffect,useContext,useRef } from "react";
import { API_URL } from "./config";
const AuthContext=createContext()
export const AuthProvider=({children})=>{
    const[accessToken,setAccessToken]=useState(null)
    const[loading,setLoading]=useState(true)
    const didRun=useRef(false)
    const refreshing=useRef(null)

    useEffect(()=>{
        const fetchNewToken=async()=>{
            try{
                const response=await fetch(`${API_URL}/api/auth/refresh`,{
                    method:'GET',
                    credentials:'include'
                })
                const data=await response.json()

                if(data.success){
                    setAccessToken(data.accessToken)
                }else{
                    setAccessToken(null)
                }
            }catch(error){
                console.error("Nhi hua refresh failed hogya",error)
                setAccessToken(null)
            }finally{
                setLoading(false)
            }
        }
        if(didRun.current)return //Strict mode mai double call se khud logout na hojaye isliye
        didRun.current=true
        fetchNewToken()
    },[])

    const refreshAccess = () => {
  if (!refreshing.current) {
    refreshing.current = (async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/refresh`, { credentials: 'include' })
        const data = await res.json()
        if (data.success) { setAccessToken(data.accessToken); return data.accessToken }
        setAccessToken(null)
        return null
      } catch (e) {
        setAccessToken(null)
        return null
      } finally {
        refreshing.current = null
      }
    })()
  }
  return refreshing.current
}

const authFetch = async (url, options = {}) => {
  const doFetch = (token) => fetch(url, {
    ...options,
    credentials: 'include',
    headers: { ...options.headers, Authorization: `Bearer ${token}` }
  })
  let res = await doFetch(accessToken)
  if (res.status === 401) {
    const newToken = await refreshAccess()
    if (!newToken) return res
    res = await doFetch(newToken)
  }
  return res
}

    return(
        <AuthContext.Provider value={{accessToken,setAccessToken,loading,authFetch}}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
export const useAuth=()=>useContext(AuthContext)