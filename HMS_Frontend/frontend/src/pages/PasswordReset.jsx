import { useState } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner,} from "@fortawesome/free-solid-svg-icons";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      await api.post("password-reset/", { email }); // maps to PasswordResetRequestSerializer
      setLoading(false)
      alert("Password reset email sent");
       
    } catch {
      setLoading(false)
      alert("Error sending reset email");
    }finally {
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 space-y-6">
        {/* Blue circular icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-slate-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        
        {/* Title and description */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Your Password</h2>
          <p className="text-gray-600">Enter your email to receive reset instructions</p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          

          {loading ? (
              <button
            type="submit"
            className="w-full bg-slate-900 text-white py-2 px-4 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200" disabled>
          <FontAwesomeIcon  icon={faSpinner} spin/>
            Sending Email
          </button>
          ) :(
              <button
            type="submit"
            className="w-full bg-slate-900 text-white py-2 px-4 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Send Reset Email
          </button>
          )}
          
        </form>
        
        {/* Back to Sign In link */}

        
        <div className="text-center mt-4">
            <Link to ="/login" className="text-sm text-blue-600 hover:underline">
               Back to Sign In
            </Link>
            
        </div>
      </div>
      
      
    </div>
  );
};

export default PasswordReset;