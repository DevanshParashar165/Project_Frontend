import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Check login status on mount
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get(
          "https://devconnectbackend-9af9.onrender.com/api/v1/users/current-user",
          { withCredentials: true }
        );
        setIsLoggedIn(!!(res.data && res.data.data));
        setUser(res.data?.data);
      } catch {
        setIsLoggedIn(false);
        setUser(null);
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
      // localStorage.removeItem("accessToken");
      // localStorage.removeItem("refreshToken");
      setIsLoggedIn(false);
      setUser(null);
      navigate("/");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <header className="bg-slate-900/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/user" className="flex items-center gap-3 group">
          <div className="relative">
            <img
              src="https://res.cloudinary.com/drdhb0h98/image/upload/v1749818228/Logo_v6jmlg.png"
              alt="Logo"
              className="h-10 w-10 rounded-xl object-cover ring-2 ring-purple-500/20 group-hover:ring-purple-500/40 transition-all"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div className="hidden sm:block">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              DevConnect
            </span>
            <p className="text-xs text-gray-400 -mt-1">Connect. Code. Create.</p>
          </div>
        </Link>

        {/* Hamburger button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-xl bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none transition-all"
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6 text-gray-300 font-medium">
            {[
              ["🎥 Videos", "/videos"],
              ["🐦 Tweets", "/tweets"],
              ["🎬 playlist","/playlist"],
              ["📊 Dashboard", "/dashboard"],
            ].map(([label, path]) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl transition-all duration-200 hover:text-white hover:bg-white/10 ${
                      isActive 
                        ? "text-white bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30" 
                        : ""
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-4">
            {isLoggedIn && user && (
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/10">
                <img 
                  src={user.avatar?.url || user.avatar} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <span className="text-sm text-gray-300 hidden lg:block">@{user.username}</span>
              </div>
            )}
            
            <button
              onClick={isLoggedIn ? logOut : () => navigate("/")}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              {isLoggedIn ? "Sign Out" : "Sign In"}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-slate-800/95 backdrop-blur-md border-t border-white/10">
          <div className="px-4 py-6 space-y-4">
            {[
              ["🎥 Videos", "/videos"],
              ["🐦 Tweets", "/tweets"],
              ["🎬 playlist","/playlist"],
              ["📊 Dashboard", "/dashboard"]
            ].map(([label, path]) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? "text-white bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30" 
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            {isLoggedIn && user && (
              <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/10 mt-4">
                <img 
                  src={user.avatar?.url || user.avatar} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div>
                  <p className="text-white font-medium">{user.fullname}</p>
                  <p className="text-gray-400 text-sm">@{user.username}</p>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setMenuOpen(false);
                isLoggedIn ? logOut() : navigate("/");
              }}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoggedIn ? "Sign Out" : "Sign In"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;