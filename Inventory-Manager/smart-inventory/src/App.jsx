import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import AddInventory from './AddInventory'
import DashBoard from './DashBoard'
import ExpiringSoon from './ExpiringSoon'
import LoginForm from './LoginForm'
import PrivateRoute from './PrivateRoute'
export default function App() {
  return (
    <BrowserRouter>
      <div className='flex justify-center gap-8 p-5 bg-gray-900 text-white shadow-Ig'>
        <Link className='font-semibold text-gray-300 hover:text-blue-400 transition-all' to='/login'>Login Form</Link>
        <Link className='font-semibold text-gray-300 hover:text-blue-400 transition-all' to='/addstock'>Add New Stock</Link>
        <Link className='font-semibold text-gray-300 hover:text-blue-400 transition-all' to='/dashboard'>DashBoard</Link>
        <Link className='font-semibold text-gray-300 hover:text-blue-400 transition-all' to='/expiringsoon'>Expiring Soon</Link>
      </div>
      <Routes>
         <Route path='/login' element={<LoginForm />} />
        <Route path='/addstock' element={<PrivateRoute><AddInventory /></PrivateRoute>} />
        <Route path='/dashboard' element={<PrivateRoute><DashBoard /></PrivateRoute>} />
        <Route path='/expiringsoon' element={<PrivateRoute><ExpiringSoon /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}