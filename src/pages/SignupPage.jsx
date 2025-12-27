import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sign Up submitted:", formData);
  };

  // Adaptive styles
  const inputClasses =
    "w-full px-4 py-3 rounded-lg border focus:ring-1 focus:ring-teal-500 transition-colors duration-200 outline-none " +
    "bg-slate-100 border-slate-300 text-slate-900 " + 
    "dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200";
  
  const buttonClasses =
    "w-full px-6 py-3 mt-8 text-lg font-semibold rounded-lg bg-teal-500 text-gray-900 hover:bg-teal-400 transition-colors duration-200 shadow-lg";

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
      <div className="w-full max-w-md p-8 sm:p-10 shadow-2xl rounded-xl border transition-colors duration-300 bg-white border-slate-200 dark:bg-gray-800 dark:border-gray-700">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Join TopCorner</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Create your account and start predicting</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">Full Name</label>
            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className={inputClasses} required />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">Username</label>
            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className={inputClasses} required />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={inputClasses} required />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className={inputClasses} required />
          </div>
          
          <button type="submit" className={buttonClasses}>Create Account</button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 dark:text-gray-400 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300 transition-colors">
              Sign in here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default SignupPage;