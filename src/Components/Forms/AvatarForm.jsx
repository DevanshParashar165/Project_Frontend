import React, { useState } from 'react';
import axios from 'axios';

function AvatarForm({ onClose }) {
  const [avatar, setAvatar] = useState(null);

  const handleChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleAvatar = async (e) => {
    e.preventDefault();
    console.log('Selected Avatar File:', avatar);
    // Upload logic here
     if (!avatar) return;

    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      const res = await axios.patch(
        `https://devconnectbackend-9af9.onrender.com/api/v1/users/avatar`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Cover image updated:', res.data);
      onClose();
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-[90%] max-w-md text-black">
        <h2 className="text-xl font-bold mb-4 text-green-700">Update Avatar</h2>
        <form onSubmit={handleAvatar}>
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="w-full border border-black p-2 rounded mb-4"
            required
          />
          <div className="flex justify-between">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800">Upload</button>
            <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AvatarForm;
