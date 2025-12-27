import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
      // 1. Call Backend API
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // 2. Success! Save user to local storage
      console.log("Login Successful:", data);
      localStorage.setItem("user", JSON.stringify(data));

      // 3. Redirect to Dashboard
      navigate("/dashboard");
      // Optional: Force a reload so Navbar updates with the new user state
      window.location.reload(); 

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Adaptive Styles
  const inputClasses =
    "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-teal-500 outline-none transition-colors " +
    "bg-slate-50 border-slate-300 text-slate-900 " +
    "dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100";
  
  const buttonClasses =
    "w-full px-6 py-3 mt-6 text-lg font-semibold rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition-all shadow-md disabled:opacity-50";

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
      <div className="w-full max-w-md p-8 shadow-2xl rounded-xl border transition-colors bg-white border-slate-200 dark:bg-gray-800 dark:border-gray-700">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Welcome Back</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Sign in to your TopCorner account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClasses} required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className={inputClasses} required />
          </div>
          
          <button type="submit" disabled={loading} className={buttonClasses}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <p className="text-slate-500 dark:text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-teal-600 dark:text-teal-400 hover:underline">
              Sign up here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;