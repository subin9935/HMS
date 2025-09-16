import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

const Privateroute = ({children}) => {
  const {isLoggedIn} = useContext(AuthContext)
  return isLoggedIn ? (
    children
  ) : (
    <Navigate to ='/login' />
  )
}

export default Privateroute