import React, { useState } from "react";
import axios from "axios";

const Patients = () => {
  const [token] = useState(localStorage.getItem("accessToken") || ""); // JWT access token
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    email: "",
    phone: "",
  });
  const [citizenshipFiles, setCitizenshipFiles] = useState([]);
  const [passportFiles, setPassportFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e, setter) => setter(Array.from(e.target.files));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponseData(null);

    if (!token) {
      setError("You must be logged in to create a patient.");
      setLoading(false);
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    console.log(citizenshipFiles, passportFiles)

    citizenshipFiles.forEach((file) => data.append("citizenship", file));
    passportFiles.forEach((file) => data.append("passport", file));

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/add-patients/",
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResponseData(res.data);
      console.log("Patient created:", res.data);
      setFormData({ first_name: "", last_name: "", date_of_birth: "", email: "", phone: "" });
      setCitizenshipFiles([]);
      setPassportFiles([]);
    } catch (err) {
      console.error(err.response);
      setError(err.response?.status === 401
        ? "Unauthorized: Invalid or expired token. Please log in again."
        : err.response?.data?.detail || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-0">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Add New Patient</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Name fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="John"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Doe"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Other info fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 890"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Document uploads */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Citizenship Documents</label>
          <input
            type="file"
            multiple
            onChange={(e) => handleFileChange(e, setCitizenshipFiles)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Passport Documents</label>
          <input
            type="file"
            multiple
            onChange={(e) => handleFileChange(e, setPassportFiles)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading || !token}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
        >
          {loading ? "Uploading..." : "Submit"}
        </button>

        {/* Success / Error messages */}
        {responseData && (
          <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg border border-green-200">
            <p className="font-medium">Patient created successfully!</p>
            <p>Uploaded Documents: {responseData.uploaded_documents?.length || 0}</p>
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg border border-red-200">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default Patients;
