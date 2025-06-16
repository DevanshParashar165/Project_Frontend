import axios from 'axios';
import React from 'react';
import { NavLink, Link ,useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate()
    const logOut = async() =>{
        try {
            await axios.post('http://localhost:8000/api/v1/users/logout',{},{
                withCredentials : true
            })
            navigate('/')
        } catch (error) {
            console.log("Error : ",error)
        }
    }

    return (
        <header className="bg-blue-950 shadow-md sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link to="/user">
                    <img src="https://res.cloudinary.com/drdhb0h98/image/upload/v1749818228/Logo_v6jmlg.png" alt="Logo" className="h-12 w-auto rounded-2xl" />
                </Link>
                <ul className="flex items-center gap-6 text-fuchsia-100 font-medium text-sm">
                    <li>
                        <NavLink to="/videos" className={({ isActive }) => `hover:text-blue-300 transition ${isActive ? 'text-blue-300' : ''}`}>
                            Videos
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/tweets" className={({ isActive }) => `hover:text-blue-300 transition ${isActive ? 'text-blue-300' : ''}`}>
                            Tweets
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/playlist" className={({ isActive }) => `hover:text-blue-300 transition ${isActive ? 'text-blue-300' : ''}`}>
                            Playlist
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard" className={({ isActive }) => `hover:text-blue-300 transition ${isActive ? 'text-blue-300' : ''}`}>
                            Dashboard
                        </NavLink>
                    </li>
                </ul>

                <input type="text" placeholder="Search..." className="hidden md:block px-4 py-1.5 rounded-md bg-blue-900 border border-blue-700 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <button onClick={logOut} className="ml-4 px-4 py-1.5 bg-blue-800 hover:bg-blue-700 text-fuchsia-100 hover:text-white border border-blue-700 rounded-md transition duration-200 shadow-sm cursor-pointer">
                    Logout
                </button>
            </nav>
        </header>
    );
}

export default Navbar;

