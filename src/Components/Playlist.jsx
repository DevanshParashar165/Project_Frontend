import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

function Playlist() {
  const [loading, setLoading] = useState(true);
  const [playlistData, setPlaylistData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({ name: "", description: "" });
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [allVideos, setAllVideos] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const [editingPlaylist, setEditingPlaylist] = useState(null);

  const navigate = useNavigate();
  
  const handleEditClick = (playlist) => {
    setEditingPlaylist(playlist);
    setEditForm({
      name: playlist.name,
      description: playlist.description,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

   const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingPlaylist) return;

    try {
      const response = await axios.patch(
        `https://devconnectbackend-9af9.onrender.com/api/v1/playlist/${editingPlaylist._id}`,
        editForm,
        { withCredentials: true }
      );
      console.log("Playlist updated:", response.data);

      // update frontend instantly
      setPlaylistData((prev) =>
        prev.map((pl) =>
          pl._id === editingPlaylist._id
            ? { ...pl, name: editForm.name, description: editForm.description }
            : pl
        )
      );

      setEditingPlaylist(null); 
    } catch (error) {
      console.log("Error updating playlist:", error);
    }
  };

  // Helper: Get video by ID
  const getVideoById = async (videoId) => {
    try {
      const res = await axios.get(
        `https://devconnectbackend-9af9.onrender.com/api/v1/videos/${videoId}`,
        { withCredentials: true }
      );
      return res.data.data; // adjust if your backend key differs
    } catch (error) {
      console.log("Error fetching video by ID:", error);
      return null;
    }
  };

  // Fetch playlists and attach first video thumbnail
  const fetchPlaylist = async () => {
    try {
      const response = await axios.get(
        "https://devconnectbackend-9af9.onrender.com/api/v1/playlist",
        { withCredentials: true }
      );

      const playlists = response.data.data.playlist || [];

      // For each playlist, fetch first video thumbnail (if any)
      const updatedPlaylists = await Promise.all(
        playlists.map(async (playlist) => {
          if (playlist.videos?.length > 0) {
            const firstVideoId = playlist.videos[0];
            const videoData = await getVideoById(firstVideoId);
            return { ...playlist, thumbnail: videoData?.thumbnail || "/Logo.png" };
          }
          return { ...playlist, thumbnail: "/Logo.png" };
        })
      );

      setPlaylistData(updatedPlaylists);
    } catch (error) {
      console.log("Error while fetching playlist:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all videos for add-video modal
  const fetchAllVideos = async () => {
    try {
      const res = await axios.get(
        "https://devconnectbackend-9af9.onrender.com/api/v1/videos/getVideo",
        { withCredentials: true }
      );
      setAllVideos(res.data.data.videos || []);
    } catch (err) {
      console.log("Error fetching videos:", err);
    }
  };

  // Create new playlist
  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://devconnectbackend-9af9.onrender.com/api/v1/playlist",
        newPlaylist,
        { withCredentials: true }
      );
      alert("Playlist created successfully!");
      setShowForm(false);
      setNewPlaylist({ name: "", description: "" });
      fetchPlaylist();
    } catch (error) {
      console.log("Error creating playlist:", error);
    }
  };

  // Delete playlist
  const handleDeletePlaylist = async (playlistId) => {
    try {
      await axios.delete(
        `https://devconnectbackend-9af9.onrender.com/api/v1/playlist/${playlistId}`,
        { withCredentials: true }
      );
      alert("Playlist deleted successfully!");
      fetchPlaylist();
    } catch (error) {
      console.log("Error deleting playlist:", error);
    }
  };

  // Open video modal
  const handleAddVideo = (playlistId) => {
    setSelectedPlaylistId(playlistId);
    fetchAllVideos();
    setShowVideoForm(true);
  };

  // Add video to playlist
  const handleAddVideoToPlaylist = async (videoId) => {
    try {
      await axios.patch(
        `https://devconnectbackend-9af9.onrender.com/api/v1/playlist/add/${videoId}/${selectedPlaylistId}`,
        {},
        { withCredentials: true }
      );
      alert("Video added to playlist!");
      setShowVideoForm(false);
      fetchPlaylist();
    } catch (error) {
      console.log("Error adding video to playlist:", error);
    }
  };



  useEffect(() => {
    fetchAllVideos();
    fetchPlaylist();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-white text-lg font-medium">Loading Playlists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 flex flex-col items-center justify-start py-12">
      {/* Create Playlist Button */}
      <button
        onClick={() => setShowForm(true)}
        className="mb-10 px-8 py-3 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white font-semibold rounded-full shadow-[0_0_15px_rgba(139,92,246,0.6)] hover:shadow-[0_0_25px_rgba(139,92,246,0.9)] hover:scale-105 transition-all duration-300"
      >
        + Create New Playlist
      </button>

      {/* Playlist Grid */}
      {playlistData.length === 0 ? (
        <p className="text-white text-lg">No playlists found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-7xl px-6">
          {playlistData.map((playlist) => (
            <div
              key={playlist._id}
              className="group relative rounded-2xl overflow-hidden shadow-lg backdrop-blur-md bg-white/5 border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]"
            >
              {/* Thumbnail */}
              <div className="relative w-full h-48 overflow-hidden" onClick={()=> navigate(`/playlist/${playlist._id}`)}>
                <img
                  src={playlist.thumbnail}
                  alt="Playlist Thumbnail"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => (e.target.src = "/Logo.png")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <h3 className="absolute bottom-3 left-4 text-white font-bold text-lg tracking-wide drop-shadow-lg">
                  {playlist.name}
                </h3>
              </div>

              {/* Info */}
              <div className="p-5 flex flex-col justify-between text-sm">
                <p className="text-gray-300 line-clamp-2 mb-3">
                  {playlist.description || "No description available."}
                </p>
                <div className="flex justify-between items-center text-gray-400 mb-4">
                  <span>🎬 {playlist.videos.length} Videos</span>
                  <span>
                    📅 {new Date(playlist.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAddVideo(playlist._id)}
                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 text-white font-medium hover:from-emerald-500 hover:to-green-400 shadow-[0_0_10px_rgba(34,197,94,0.5)] hover:shadow-[0_0_20px_rgba(34,197,94,0.7)] transition-all duration-200"
                  >
                    + Add
                  </button>

                  <button
                    onClick={() => handleEditClick(playlist)}
                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-medium hover:from-orange-400 hover:to-yellow-400 shadow-[0_0_10px_rgba(251,191,36,0.5)] hover:shadow-[0_0_20px_rgba(251,191,36,0.7)] transition-all duration-200"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => handleDeletePlaylist(playlist._id)}
                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:from-pink-500 hover:to-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] hover:shadow-[0_0_20px_rgba(239,68,68,0.7)] transition-all duration-200"
                  >
                    🗑️Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Playlist Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-slate-900/90 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-purple-500/30 text-white">
            <h2 className="text-2xl font-bold mb-6 text-center text-purple-400">
              Create New Playlist
            </h2>
            <form onSubmit={handleCreatePlaylist} className="space-y-5">
              <div>
                <label className="block mb-2 text-sm text-gray-300">
                  Playlist Name
                </label>
                <input
                  type="text"
                  required
                  value={newPlaylist.name}
                  onChange={(e) =>
                    setNewPlaylist({ ...newPlaylist, name: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-800/70 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter playlist name"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm text-gray-300">
                  Description
                </label>
                <textarea
                  value={newPlaylist.description}
                  onChange={(e) =>
                    setNewPlaylist({
                      ...newPlaylist,
                      description: e.target.value,
                    })
                  }
                  rows="3"
                  className="w-full px-4 py-2 bg-slate-800/70 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter playlist description"
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold shadow-[0_0_15px_rgba(139,92,246,0.6)] hover:shadow-[0_0_25px_rgba(139,92,246,0.9)] transition-all duration-300"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Video Modal */}
      {showVideoForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-2xl w-full max-w-lg">
            <h2 className="text-xl text-white font-semibold mb-4">
              Add Video to Playlist
            </h2>
            {allVideos.length === 0 ? (
              <p className="text-gray-300 text-center">No videos found.</p>
            ) : (
              <div className="max-h-64 overflow-y-auto space-y-3">
                {allVideos.map((video) => (
                  <div
                    key={video._id}
                    className="flex items-center justify-between bg-slate-800 p-3 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-16 h-10 rounded-md object-cover"
                      />
                      <p className="text-white text-sm">{video.title}</p>
                    </div>
                    <button
                      onClick={() => handleAddVideoToPlaylist(video._id)}
                      className="bg-indigo-600 px-3 py-1.5 rounded-lg text-white text-sm hover:bg-indigo-500 transition"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setShowVideoForm(false)}
              className="mt-4 bg-gray-700 px-4 py-2 rounded-lg text-white hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
       {/* 🔹 Edit Form Modal */}
      {editingPlaylist && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <form
      onSubmit={handleEditSubmit}
      className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-2xl w-full max-w-lg"
    >
      <h2 className="text-xl text-white font-semibold mb-4 text-center">
        ✏️ Edit Playlist
      </h2>

      {/* Playlist Name */}
      <label className="block mb-2 text-sm text-gray-300">Name</label>
      <input
        type="text"
        name="name"
        value={editForm.name}
        onChange={handleEditChange}
        placeholder="Enter playlist name"
        className="w-full mb-4 px-4 py-2 rounded-lg bg-slate-800 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 transition"
      />

      {/* Playlist Description */}
      <label className="block mb-2 text-sm text-gray-300">Description</label>
      <textarea
        name="description"
        value={editForm.description}
        onChange={handleEditChange}
        placeholder="Enter description"
        className="w-full mb-4 px-4 py-2 rounded-lg bg-slate-800 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 transition min-h-[100px]"
      ></textarea>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={() => setEditingPlaylist(null)}
          className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
        >
          Save Changes
        </button>
      </div>
    </form>
  </div>
)}

    </div>
  );
}

export default Playlist;
