import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PasswordReset from "./pages/PasswordReset";
import PasswordResetConfirm from "./pages/PasswordResetConfirm";
import { useState } from 'react'
import AuthProvider from "./context/AuthContext";
import Privateroute from "./routes/PrivateRoute";
import Publicroute from "./routes/PublicRoute";
import Layout from './pages/Layout';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Insurance from './pages/Insurance';
import Dashboard from "./pages/Dashboard";
import ChangePassword from "./pages/ChangePassword";


function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Publicroute><Register/></Publicroute> } /> 
        <Route path='/password-reset' element={<Publicroute><PasswordReset /></Publicroute> } /> 
        <Route path='/password-reset-confirm' element={<Publicroute><PasswordResetConfirm /></Publicroute> } /> 
               
          <Route path="/" element={<Privateroute><Layout /></Privateroute>}>
          <Route index element={<Privateroute><Dashboard /></Privateroute>} />
          <Route path="patients" element={<Privateroute><Patients /></Privateroute>} />
          <Route path="change-password" element={<Privateroute><ChangePassword /></Privateroute>} />
          <Route path="doctors" element={<Privateroute><Doctors /></Privateroute>} />
          <Route path="appointments" element={<Privateroute><Appointments /></Privateroute>} />
          <Route path="insurance" element={<Privateroute><Insurance /></Privateroute>} />
          
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
