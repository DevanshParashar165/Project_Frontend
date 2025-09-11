import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on component mount
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get('https://devconnectbackend-9af9.onrender.com/api/v1/users/current-user', {
          withCredentials: true,
        });
        if (res.data && res.data.data) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.log('Not logged in:', error);
        setIsLoggedIn(false);
      }
    };

    checkLogin();
  }, []);

  const handleSearch = () => {
    
  }

  const logOut = async () => {
    try {
      await axios.post('https://devconnectbackend-9af9.onrender.com/api/v1/users/logout', {}, { withCredentials: true });
      setIsLoggedIn(false);
      navigate('/');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <header className="bg-blue-950 shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/user" className="flex items-center gap-2">
          <img
            src="https://res.cloudinary.com/drdhb0h98/image/upload/v1749818228/Logo_v6jmlg.png"
            alt="Logo"
            className="h-10 w-10 rounded-2xl object-cover"
          />
          <span className="hidden sm:inline text-fuchsia-100 font-semibold text-lg">DevConnect</span>
        </Link>

        {/* NavLinks */}
        <ul className="hidden md:flex items-center gap-6 text-fuchsia-100 font-medium text-sm">
          {[
            ['Videos', '/videos'],
            ['Tweets', '/tweets'],
            ['Dashboard', '/dashboard'],
          ].map(([label, path]) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `transition duration-200 hover:text-blue-300 ${isActive ? 'text-blue-300 underline underline-offset-4' : ''
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Search + Logout/Signin */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* <input
            type="text"
            placeholder="Search..."
            className="px-4 py-1.5 bg-blue-900 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            className="p-2 text-white cursor-pointer hover:bg-blue-700 transition border-b-blue-500 rounded-2xl"
            aria-label="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
              />
            </svg>
          </button> */}
          <button
            onClick={isLoggedIn ? logOut : () => navigate('/')}
            className="px-4 py-1.5 bg-blue-800 cursor-pointer hover:bg-blue-700 text-fuchsia-100 hover:text-white border border-blue-700 rounded-md transition duration-200 shadow-sm"
          >
            {isLoggedIn ? 'Logout' : 'Sign In'}
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
