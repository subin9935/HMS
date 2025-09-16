import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

const Publicroute = ({children}) => {
  const {isLoggedIn} = useContext(AuthContext)
  return !isLoggedIn ? (
    children
  ) : (
    <Navigate to ='/' />
  )
}

export default Publicroute