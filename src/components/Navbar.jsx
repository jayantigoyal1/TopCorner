import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Aperture } from "lucide-react";

const navItems = [
  { name: "Home", path: "/", isAuth: undefined },
  { name: "Login", path: "/login", isAuth: false },
  { name: "Dashboard", path: "/dashboard", isAuth: true },
  { name: "My Leagues", path: "/leagues", isAuth: true },
  { name: "Schedule", path: "/schedule", isAuth: true },
  { name: "Profile", path: "/profile", isAuth: true },
];

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(true); // Simulated auth
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    console.log("Simulating Logout...");
    setIsAuthenticated(false);
  };

  const getLinkClasses = (path) => {
    const isActive = location.pathname === path;
    let classes =
      "text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer whitespace-nowrap";
    if (isActive) {
      classes += " bg-gray-700 text-white shadow-lg";
    } else {
      classes += " text-gray-300 hover:bg-gray-700 hover:text-white";
    }
    return classes;
  };

  const ctaClasses =
    "text-sm font-semibold px-4 py-2 rounded-lg bg-teal-500 text-gray-900 hover:bg-teal-400 transition-all duration-200 shadow-md ml-4 whitespace-nowrap";
  const logoutClasses =
    "text-sm font-semibold px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-all duration-200 ml-4 whitespace-nowrap";

  const filteredNavItems = navItems.filter((item) => {
    if (item.isAuth === undefined) return true;
    if (item.isAuth === true) return isAuthenticated;
    if (item.isAuth === false) return !isAuthenticated;
    return true;
  });

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800/90 backdrop-blur-md border-b border-gray-700 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-bold text-teal-400 p-1 rounded-lg hover:text-teal-300 transition-all"
          >
            <Aperture className="w-6 h-6" />
            <span className="hidden sm:inline">TopCorner</span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center space-x-2 overflow-x-auto">
            {filteredNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={getLinkClasses(item.path)}
              >
                {item.name}
              </Link>
            ))}

            {!isAuthenticated && <Link to="/signup" className={ctaClasses}>Join Now</Link>}
            {isAuthenticated && <button onClick={handleLogout} className={logoutClasses}>Logout</button>}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800/95 backdrop-blur-md border-t border-gray-700 px-4 py-4 space-y-3">
          {filteredNavItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-gray-300 hover:text-teal-400 transition-all duration-200"
            >
              {item.name}
            </Link>
          ))}
          {!isAuthenticated && (
            <Link
              to="/signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className={ctaClasses + " block text-center mt-2"}
            >
              Join Now
            </Link>
          )}
          {isAuthenticated && (
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className={logoutClasses + " block w-full text-center mt-2"}
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
