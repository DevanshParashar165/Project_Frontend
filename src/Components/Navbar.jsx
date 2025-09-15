import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Check login status on mount
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get(
          "https://devconnectbackend-9af9.onrender.com/api/v1/users/current-user",
          { withCredentials: true }
        );
        setIsLoggedIn(!!(res.data && res.data.data));
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, []);

  const logOut = async () => {
    try {
      await axios.post(
        "https://devconnectbackend-9af9.onrender.com/api/v1/users/logout",
        {},
        { withCredentials: true }
      );
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <header className="bg-blue-950 shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/user" className="flex items-center gap-2">
          <img
            src="https://res.cloudinary.com/drdhb0h98/image/upload/v1749818228/Logo_v6jmlg.png"
            alt="Logo"
            className="h-10 w-10 rounded-2xl object-cover"
          />
          <span className="hidden sm:inline text-fuchsia-100 font-semibold text-lg">
            DevConnect
          </span>
        </Link>

        {/* Hamburger button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-fuchsia-100 focus:outline-none"
        >
          {menuOpen ? (
            // Close Icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger Icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-6 text-fuchsia-100 font-medium text-sm">
          {[
            ["Videos", "/videos"],
            ["Tweets", "/tweets"],
            ["Dashboard", "/dashboard"],
          ].map(([label, path]) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `transition duration-200 hover:text-blue-300 ${
                    isActive ? "text-blue-300 underline underline-offset-4" : ""
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Logout / Sign in */}
        <button
          onClick={isLoggedIn ? logOut : () => navigate("/")}
          className="hidden md:block px-4 py-1.5 bg-blue-800 hover:bg-blue-700 text-fuchsia-100 border border-blue-700 rounded-md transition duration-200"
        >
          {isLoggedIn ? "Logout" : "Sign In"}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-900 px-4 py-3 flex flex-col gap-4">
          {[
            ["Videos", "/videos"],
            ["Tweets", "/tweets"],
            ["Dashboard", "/dashboard"],
          ].map(([label, path]) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block py-1 hover:text-blue-300 ${
                  isActive ? "text-blue-300 underline underline-offset-4" : "text-fuchsia-100"
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          <button
            onClick={() => {
              setMenuOpen(false);
              isLoggedIn ? logOut() : navigate("/");
            }}
            className="px-4 py-1.5 bg-blue-800 hover:bg-blue-700 text-fuchsia-100 border border-blue-700 rounded-md transition duration-200"
          >
            {isLoggedIn ? "Logout" : "Sign In"}
          </button>
        </div>
      )}
    </header>
  );
}

export default Navbar;
