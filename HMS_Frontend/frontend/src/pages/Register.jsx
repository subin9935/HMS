import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("register/", form); // maps to CustomerUserRegisterSerializer
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      alert("Error registering user");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        {/* Header with icon and welcome text */}
        <div className="text-center mb-8">
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Register</h2>
         
        </div>

        <form onSubmit={handleSubmit} className="space-y-1">
          
           <div>
          
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
            
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter your Username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>
          {/* Password field with show/hide toggle */}
          <div>
            
            <div className="relative">
              <input
                type="password"
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

          {/* Remember me and Forget password */}
          
          {/* Register In button */}
          <br></br>
          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-700 transition duration-300 font-medium "
          >
            Register
          </button>
        </form>

        {/* Footer text */}
        <div className="mt-8 text-center text-sm text-gray-500">
          HMS
        </div>
      </div>
    </div>
  );
};

export default Register;
