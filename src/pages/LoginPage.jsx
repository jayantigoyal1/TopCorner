import React, { useState } from "react";
import { Link } from "react-router-dom"; // Assuming you have react-router-dom for navigation

const LoginPage = () => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted:", formData);
    // Add your actual login logic here (e.g., API call)
  };

  // Base input classes for the dark theme
  const inputClasses =
    "w-full px-4 py-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors duration-200 outline-none";
  
  // Teal button classes matching the Navbar's Join Now button
  const buttonClasses =
    "w-full px-6 py-3 mt-6 text-lg font-semibold rounded-lg bg-teal-500 text-gray-900 hover:bg-teal-400 transition-colors duration-200 shadow-lg";

  return (
    // Centering the card vertically and horizontally in the remaining viewport
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] pt-16 px-4 sm:px-6">
      <div className="w-full max-w-md p-8 sm:p-10 bg-gray-800 shadow-2xl rounded-xl border border-gray-700">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">Welcome Back</h1>
          <p className="text-gray-400 text-sm">Sign in to your TopCorner account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>
          
          {/* Forgot Password Link */}
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors">
              Forgot Password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button type="submit" className={buttonClasses}>
            Sign In
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-teal-400 hover:text-teal-300 transition-colors">
              Sign up here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
