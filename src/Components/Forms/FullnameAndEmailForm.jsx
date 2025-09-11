import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

function FullnameAndEmailForm({ onClose }) {
  const [formData, setFormData] = useState({
    fullname: '',
    email: ''
  });

  useEffect(() => {
    // Populate the email from token on mount
    const token = Cookies.get('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.email) {
          setFormData(prev => ({ ...prev, email: decoded.email }));
        }
      } catch (err) {
        console.error('Invalid token');
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.patch(
      'https://devconnectbackend-9af9.onrender.com/api/v1/users/update-account',
      {
        fullname: formData.fullname,
        email: formData.email
      },
      {
        withCredentials: true
      }
    );
    console.log('Updated Details:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-[90%] max-w-md text-black">
        <h2 className="text-xl font-bold mb-4 text-green-700">Update Account Details</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            placeholder="Enter new fullname"
            className="w-full border border-black p-2 rounded mb-4"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter new email"
            className="w-full border border-black p-2 rounded mb-4"
            required
          />
          <div className="flex justify-between">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800">Update</button>
            <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FullnameAndEmailForm;
