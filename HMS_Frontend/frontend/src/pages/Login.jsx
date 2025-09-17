import React,{useContext, useState} from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom' // For Navigation
import { AuthContext } from '../context/AuthContext'
import { Link } from "react-router-dom"; 

import Home from './Home'


const Login = () => {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error,setError] = useState({})
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()
    const {setIsLoggedIn} = useContext(AuthContext)
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  

    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true)

        // Make User Data Object
        const UserData = {
           username: form.username,
            password: form.password

        }
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/token/',UserData)
            localStorage.setItem('accessToken',response.data.access)
            localStorage.setItem('refreshToken',response.data.refresh)

            console.log('response.data =>' ,response.data)
            console.log('Login Success')

            const userResponse = await axios.get('http://127.0.0.1:8000/api/profile/',{
                headers: {
                    Authorization: `Bearer ${response.data.access}`
                }
            });
            
            console.log('userResponse.data =>', userResponse.data)
            localStorage.setItem('userInfo',JSON.stringify(userResponse.data))
            // Redirect to Home Page
            navigate("/")
            setError({})
            setLoading(false)
            setIsLoggedIn(true)
           
        
        }catch(error){
            console.error('Login Failed:' , error.response.data)
            setError(error.response.data)

        }finally{
            setLoading(false)
        }

        

    }
    
    const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        {/* Header with icon and welcome text */}
        <div className="text-center mb-8">
          <div className="bg-slate-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <img src="src/assets/ntlogo.webp" alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome Back</h2>
         
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Employee ID field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          {/* Password field with show/hide toggle */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pr-10"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
               <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          {/* Remember me and Forget password */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <Link to ="/password-reset" className="text-sm text-blue-600 hover:underline">
              Forget password?
            </Link>
          </div>

          {/* Sign In button */}
          
          {loading ? (
                              <button type ="submit" className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-700 transition duration-300 font-medium" disabled><FontAwesomeIcon  icon={faSpinner} spin/> Signing In</button>
                           ) : (
                              <button  type="submit" className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-700 transition duration-300 font-medium">Sign In
          </button>
                           )}

          <Link to ="/register" className="text-sm text-blue-600 hover:underline">
              Not Resistered Yet ? Click here to Register .
            </Link>
          
        </form>

        {/* Footer text */}
       
      </div>
    </div>
  );
};

export default Login;