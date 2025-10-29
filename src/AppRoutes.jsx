import React, { useEffect } from 'react';
import Navbar from './Components/Navbar';
import Login from './Components/LoginAndRegister';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import User from './Components/User';
import Video from './Components/Video';
import Tweet from './Components/Tweet';
import Playlist from './Components/Playlist';
import PlaylistVideos from "./Components/PlaylistVideos";

function AppRoutes() {
  const location = useLocation();
  // const navigate = useNavigate();

  const hideNavbarOn = ['/', '/login'];

  // useEffect(() => {
  //   // Check for tokens in localStorage
  //   const accessToken = localStorage.getItem('accessToken');
  //   const refreshToken = localStorage.getItem('refreshToken');

  //   // Check for tokens in cookies
  //   const cookies = document.cookie;
  //   const hasCookieToken =
  //     cookies.includes('accessToken=') || cookies.includes('refreshToken=');

  //   // Redirect to /videos if tokens exist and current path is "/"
  //   if ((accessToken || refreshToken || hasCookieToken) && location.pathname === '/') {
  //     navigate('/videos', { replace: true });
  //   }
  // }, [location, navigate]);

  return (
    <>
      {!hideNavbarOn.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<User />} />
        <Route path="/videos" element={<Video />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tweets" element={<Tweet />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/playlist/:id" element={<PlaylistVideos />} /> 
        {/* Add more routes here */}
      </Routes>
    </>
  );
}

export default AppRoutes;
