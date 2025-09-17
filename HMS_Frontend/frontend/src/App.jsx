import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PasswordReset from "./pages/PasswordReset";
import PasswordResetConfirm from "./pages/PasswordResetConfirm";
import { useState } from 'react'
import AuthProvider from "./context/AuthContext";
import Privateroute from "./routes/PrivateRoute";
import Publicroute from "./routes/PublicRoute";



function App() {
  return (
    <>

      <AuthProvider>
          <BrowserRouter>
            
              <Routes>
                <Route path='/' element={<Privateroute><Home /></Privateroute>} /> 
                <Route path='/register' element={<Publicroute><Register/></Publicroute> } /> 
                <Route path='/login' element={<Publicroute><Login /></Publicroute> } /> 
                <Route path='/password-reset' element={<Publicroute><PasswordReset /></Publicroute> } /> 
                <Route path='/password-reset-confirm' element={<Publicroute><PasswordResetConfirm /></Publicroute> } /> 
                
                         </Routes>
           
        </BrowserRouter>
      </AuthProvider>
      
    </>
  )
}

export default App


