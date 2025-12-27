import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Aperture, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const navItems = [
  { name: "Home", path: "/", isAuth: undefined },
  { name: "Login", path: "/login", isAuth: false },
  { name: "Dashboard", path: "/dashboard", isAuth: true },
  { name: "My Leagues", path: "/leagues", isAuth: true },
  { name: "Schedule", path: "/schedule", isAuth: true },
  { name: "Profile", path: "/profile", isAuth: true },
];

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(true);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    console.log("Simulating Logout...");
    setIsAuthenticated(false);
  };

  const getLinkClasses = (path) => {
    const isActive = location.pathname === path;

    return `
      text-sm font-medium px-4 py-2 rounded-lg transition-all whitespace-nowrap
      ${
        isActive
          ? "bg-teal-500 text-slate-900 shadow-md"
          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
      }
    `;
  };

  const ctaClasses =
    "text-sm font-semibold px-4 py-2 rounded-lg bg-teal-500 text-slate-900 hover:bg-teal-400 transition-all shadow-md ml-4 whitespace-nowrap";

  const logoutClasses =
    "text-sm font-semibold px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all ml-4 whitespace-nowrap";

  const filteredNavItems = navItems.filter((item) => {
    if (item.isAuth === undefined) return true;
    if (item.isAuth === true) return isAuthenticated;
    if (item.isAuth === false) return !isAuthenticated;
    return true;
  });

  return (
    <header
      className="
        fixed top-0 left-0 right-0 z-50
        bg-white/80 dark:bg-slate-800/90
        backdrop-blur-md border-b
        border-slate-200 dark:border-slate-700
        shadow-xl
      "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-bold text-teal-500 hover:text-teal-400 transition-all"
          >
            <Aperture className="w-6 h-6" />
            <span className="hidden sm:inline">TopCorner</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {filteredNavItems.map((item) => (
              <Link key={item.name} to={item.path} className={getLinkClasses(item.path)}>
                {item.name}
              </Link>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="
                ml-2 p-2 rounded-lg border
                border-slate-300 dark:border-slate-600
                hover:bg-slate-100 dark:hover:bg-slate-700
                transition-all
              "
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </button>

            {!isAuthenticated && <Link to="/signup" className={ctaClasses}>Join Now</Link>}
            {isAuthenticated && (
              <button onClick={handleLogout} className={logoutClasses}>
                Logout
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 dark:text-slate-300 text-xl"
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-4 py-4 space-y-3">
          {filteredNavItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-slate-600 dark:text-slate-300 hover:text-teal-500 transition"
            >
              {item.name}
            </Link>
          ))}

          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center space-x-2 p-2 rounded-lg border border-slate-300 dark:border-slate-600"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-5 h-5 text-yellow-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-5 h-5 text-slate-700" />
                <span>Dark Mode</span>
              </>
            )}
          </button>

          {isAuthenticated && (
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className={logoutClasses + " w-full text-center"}
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
