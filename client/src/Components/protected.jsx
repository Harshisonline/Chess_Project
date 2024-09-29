import React from 'react'
import { Outlet,Navigate } from 'react-router-dom'
import { useAuth } from '../Contexts/authContext';

const ProtectedRoute = ({children}) => {
  const {isLoggedIn,setIsLoggedIn}=useAuth()
  return (
    isLoggedIn?<Outlet/>:<Navigate to={'/login'}/>
  )
}

export default ProtectedRoute