import React, { useState } from 'react';
import axios from 'axios';

function CoverImageForm({ onClose }) {
  const [coverImage, setCoverImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
    
    // Create preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleCover = async (e) => {
    e.preventDefault();
    if (!coverImage) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("coverImage", coverImage);

    try {
      const res = await axios.patch(
        `https://devconnectbackend-9af9.onrender.com/api/v1/users/cover-image`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Cover image updated:', res.data);
      alert('Cover image updated successfully!');
      onClose();
    } catch (err) {
      console.error("Error uploading image:", err);
      alert('Failed to update cover image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800/90 backdrop-blur-xl text-white p-8 rounded-3xl w-full max-w-md border border-white/10 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">🌄 Update Cover Image</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleCover} className="space-y-6">
          {/* Preview */}
          {preview && (
            <div className="text-center">
              <div className="w-full h-32 mx-auto rounded-xl overflow-hidden border-2 border-white/10">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <p className="text-sm text-gray-400 mt-2">Preview</p>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Choose Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-sm text-gray-300 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:bg-green-500/20 file:text-green-300 hover:file:bg-green-500/30 file:transition-all"
              required
            />
            <p className="text-xs text-gray-500">Recommended: 1200x400px, JPG/PNG (Max 5MB)</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              type="submit" 
              disabled={isLoading || !coverImage}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Uploading...
                </div>
              ) : (
                'Update Cover'
              )}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 bg-gray-600/50 hover:bg-gray-600/70 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CoverImageForm;