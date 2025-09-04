import React, { useState } from 'react';
import axios from 'axios';

function CoverImageForm({ onClose }) {
  const [coverImage, setCoverImage] = useState(null);

  const handleChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleCover = async (e) => {
    e.preventDefault();
    if (!coverImage) return;

    const formData = new FormData();
    formData.append("coverImage", coverImage);

    try {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/users/cover-image`,
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
        <h2 className="text-xl font-bold mb-4 text-green-700">Update Cover Image</h2>
        <form onSubmit={handleCover}>
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

export default CoverImageForm;
