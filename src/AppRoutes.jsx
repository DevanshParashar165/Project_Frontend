import React from 'react';
import Navbar from './Components/Navbar';
import Login from './Components/LoginAndRegister';  
import { Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import User from './Components/User';
import Video from './Components/Video';

function AppRoutes() {
  const location = useLocation();
  const hideNavbarOn = ['/', '/login'];

  return (
    <>
      {!hideNavbarOn.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path='/user' element={<User/>}/>
        <Route path='/videos' element={<Video/>}/>
        <Route path="/login" element={<Login />} />
        <Route path='/dashboard' element={<Dashboard/>}/>
        {/* Add more routes here */}
      </Routes>
    </>
  );
}

export default AppRoutes;
