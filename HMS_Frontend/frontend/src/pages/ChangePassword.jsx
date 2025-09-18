import React, { useContext, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ChangePassword = () => {
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AuthContext);

  // Password visibility states
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // ✅ Confirm password validation
    if (form.new_password !== form.confirm_password) {
      setError("New password and confirm password do not match");
      setLoading(false);
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      let response;

      try {
        // 🔹 First try with access token
        response = await axios.post(
          "http://127.0.0.1:8000/api/change-password/",
          {
            current_password: form.old_password,
            new_password: form.new_password,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } catch (err) {
        // 🔹 If unauthorized, refresh token
        if (err.response?.status === 401 && refreshToken) {
          const refreshResponse = await axios.post(
            "http://127.0.0.1:8000/api/token/refresh/",
            { refresh: refreshToken }
          );

          const newAccessToken = refreshResponse.data.access;
          localStorage.setItem("accessToken", newAccessToken);

          // Retry request with new access token
          response = await axios.post(
            "http://127.0.0.1:8000/api/change-password/",
            {
              current_password: form.old_password,
              new_password: form.new_password,
            },
            {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            }
          );
        } else {
          throw err;
        }
      }

      console.log("Change Password Success:", response.data);

      setSuccess("Password changed successfully. Redirecting to login...");

      // ✅ Clear tokens & force re-login
      setTimeout(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userInfo");

        navigate("/login");
        setIsLoggedIn(false);
      }, 2000);
    } catch (error) {
      console.error("Change Password Failed:", error.response?.data);
      // Improved error handling
      if (error.response?.data) {
        const data = error.response.data;

        if (data.detail) {
          setError(data.detail);
        } else if (typeof data === "object") {
          const firstKey = Object.keys(data)[0];
          const firstError = Array.isArray(data[firstKey])
            ? data[firstKey][0]
            : data[firstKey];
          setError(firstError);
        } else {
          setError("An unknown error occurred.");
        }
      } else {
        setError(error.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Change Password
          </h2>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          {/* Old Password */}
          <div>
            <label
              htmlFor="old_password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Old Password
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                name="old_password"
                id="old_password"
                placeholder="Enter your old password"
                value={form.old_password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pr-10"
                required
              />
              <button
                type="button"
                tabIndex={-1} 
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={showOldPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="new_password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="new_password"
                id="new_password"
                placeholder="Enter your new password"
                value={form.new_password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pr-10"
                required
              />
              <button
                type="button"
                tabIndex={-1} 
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label
              htmlFor="confirm_password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirm_password"
                id="confirm_password"
                placeholder="Re-enter the password"
                value={form.confirm_password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pr-10"
                required
              />
              <button
                type="button"
                tabIndex={-1} 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          {loading ? (
            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-700 transition duration-300 font-medium"
              disabled
            >
              <FontAwesomeIcon icon={faSpinner} spin /> Changing...
            </button>
          ) : (
            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-700 transition duration-300 font-medium"
            >
              Change Password
            </button>
          )}

          {/* Error Alert */}
          {error && (
            <div
              className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-3"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div
              className="flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-3"
              role="alert"
            >
              <span className="block sm:inline">{success}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
