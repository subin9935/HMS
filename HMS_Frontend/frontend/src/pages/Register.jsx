import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { Link } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const [loading,setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    };
  
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("register/", form); // maps to CustomerUserRegisterSerializer
      alert("Registration successful!");
      setLoading(false)
      navigate("/login");
    } catch (err) {
      alert("Error registering user");
    }finally {
      setLoading(false)
    }
    };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        {/* Header with icon and welcome text */}
        <div className="text-center mb-8">
          <div className="bg-slate-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <img src="src/assets/ntlogo.webp" alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Register</h2>
         
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
         
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="Enter your Email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>
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
             
            </div>
          </div>

          
          {/* Sign In button */}
          
          {loading ? (
                              <button type ="submit" className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-700 transition duration-300 font-medium" disabled><FontAwesomeIcon  icon={faSpinner} spin/> Please wait.</button>
                           ) : (
                              <button  type="submit" className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-700 transition duration-300 font-medium">Register
          </button>
                           )}

           {/* Register link */}
          <Link
            to="/login"
            className="block text-sm text-blue-600 hover:underline text-center mt-2"
          >
            Back to Sign in
          </Link>
          
        </form>

        {/* Footer text */}
       
      </div>
    </div>
  );
};

export default Register;
