import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../Contexts/authContext'
import Navbar from '../navbar/navbar'

function landingPage() {
  const {isLoggedIn}=useAuth()
  console.log(isLoggedIn)
  return (
    <div>
        <Navbar/>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
    </div>
  )
}

export default landingPage