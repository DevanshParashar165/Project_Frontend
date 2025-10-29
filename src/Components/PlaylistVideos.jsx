import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function PlaylistVideos() {
  const { id } = useParams(); // playlist ID from URL
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const getPlaylistVideos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://devconnectbackend-9af9.onrender.com/api/v1/playlist/${id}`,
        { withCredentials: true }
      );

      const playlist = response.data?.data?.playlist;
      if (playlist) {
        setPlaylistName(playlist.name);

        // Fetch each video’s details
        const videoData = await Promise.all(
          (playlist.videos || []).map(async (vidId) => {
            const res = await axios.get(
              `https://devconnectbackend-9af9.onrender.com/api/v1/videos/${vidId}`,
              { withCredentials: true }
            );
            return res.data.data;
          })
        );

        setVideos(videoData.filter((v) => v)); // remove any nulls
      }
    } catch (error) {
      console.error("Error fetching playlist videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPlaylistVideos();
  }, [id]);

  const handleFullScreenAndViews = async (videoElement, vidId) => {
    if (!document.fullscreenElement) {
      if (videoElement.requestFullscreen) {
        await videoElement.requestFullscreen();
      }
      try {
        await axios.patch(
          `https://devconnectbackend-9af9.onrender.com/api/v1/videos/views/${vidId}`,
          {},
          { withCredentials: true }
        );
      } catch (error) {
        console.error("Error updating views:", error);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  };

  const filteredVideos = videos.filter(
    (v) =>
      v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading playlist videos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
              🎵 {playlistName || "Playlist"}
            </h1>
            <p className="text-gray-400">
              Watch all videos from this playlist
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
          >
            ⬅ Back
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search in playlist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        {filteredVideos.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🎬</div>
            <h2 className="text-2xl font-bold text-gray-300 mb-2">
              No videos in this playlist
            </h2>
            <p className="text-gray-500">
              Try adding some videos or adjusting your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <div
                key={video._id}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <video
                    controls
                    className="w-full h-48 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                    src={video.videoFile}
                    poster={video.thumbnail}
                    title={video.title}
                    onClick={(e) =>
                    handleFullScreenAndViews(e.target, video._id)
                    }
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-white text-sm">
                    <span className="bg-black/50 px-2 py-1 rounded-lg">
                      👁️ {video.views || 0}
                    </span>
                    <span className="bg-black/50 px-2 py-1 rounded-lg">
                      {new Date(video.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white truncate mb-1">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          {video.views || 0} views
                        </span>
                      </div>
                      <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-6 text-gray-400">
                        <button className="flex items-center gap-2 hover:text-blue-400 transition-colors group/btn">
                          <div className="p-2 rounded-full group-hover/btn:bg-blue-500/10 transition-colors">
                            💬
                          </div>
                          <span className="text-sm">Reply</span>
                        </button>
                        
                        <button className="flex items-center gap-2 hover:text-green-400 transition-colors group/btn">
                          <div className="p-2 rounded-full group-hover/btn:bg-green-500/10 transition-colors">
                            🔄
                          </div>
                          <span className="text-sm">Retweet</span>
                        </button>
                        
                        <button className="flex items-center gap-2 hover:text-red-400 transition-colors group/btn">
                          <div className="p-2 rounded-full group-hover/btn:bg-red-500/10 transition-colors">
                            ❤️
                          </div>
                          <span className="text-sm">Like</span>
                        </button>
                        
                        <button className="flex items-center gap-2 hover:text-purple-400 transition-colors group/btn">
                          <div className="p-2 rounded-full group-hover/btn:bg-purple-500/10 transition-colors">
                            📤
                          </div>
                          <span className="text-sm">Share</span>
                        </button>
                      </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlaylistVideos;
