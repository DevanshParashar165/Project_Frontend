import axios from 'axios';
import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const logOut = async () => {
    try {
      await axios.post(
        'http://localhost:8000/api/v1/users/logout',
        {},
        { withCredentials: true }
      );
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
            ['Playlist', '/playlist'],
            ['Dashboard', '/dashboard'],
          ].map(([label, path]) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `transition duration-200 hover:text-blue-300 ${
                    isActive ? 'text-blue-300 underline underline-offset-4' : ''
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Search + Logout */}
        <div className="flex items-center gap-2 md:gap-4">
          <input
            type="text"
            placeholder="Search..."
            className="hidden md:block px-4 py-1.5 rounded-md bg-blue-900 border border-blue-700 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={logOut}
            className="px-4 py-1.5 bg-blue-800 hover:bg-blue-700 text-fuchsia-100 hover:text-white border border-blue-700 rounded-md transition duration-200 shadow-sm"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
