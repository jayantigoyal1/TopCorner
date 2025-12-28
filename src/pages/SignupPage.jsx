import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from '../config';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Send data to your Backend
      const response = await fetch("${API_BASE_URL}/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // 2. Success! Redirect to Login
      alert("Account created successfully! Please log in.");
      navigate("/login");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Adaptive Styles (Light/Dark)
  const inputClasses =
    "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-teal-500 outline-none transition-colors " +
    "bg-slate-50 border-slate-300 text-slate-900 " + // Light Mode
    "dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"; // Dark Mode

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
      <div className="w-full max-w-md p-8 shadow-2xl rounded-xl border transition-colors bg-white border-slate-200 dark:bg-gray-800 dark:border-gray-700">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Join TopCorner</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Create your account to start predicting</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-gray-300">Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={inputClasses} required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-gray-300">Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} className={inputClasses} required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-gray-300">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClasses} required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-gray-300">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className={inputClasses} required />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 mt-4 text-lg font-semibold rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition-all shadow-md disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-slate-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-teal-600 dark:text-teal-400 hover:underline">
              Sign in here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default SignupPage;