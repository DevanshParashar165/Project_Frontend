import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Video() {
  const [videoData, setVideoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const getVideo = async () => {
    try {
      const response = await axios.get(`https://devconnectbackend-9af9.onrender.com/api/v1/videos/getVideo`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });

      const videos = response.data?.data?.videos || [];
      setVideoData(videos);
    } catch (error) {
      console.log("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVideo();
  }, []);

  const handleFullScreenAndViews = async (videoElement, id) => {
    if (!document.fullscreenElement) {
      if (videoElement.requestFullscreen) {
        await videoElement.requestFullscreen();
      }

      try {
        await axios.patch(`https://devconnectbackend-9af9.onrender.com/api/v1/videos/views/${id}`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        });
        getVideo();
      } catch (error) {
        console.error("Views can't increase due to error : ", error);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  };

  const filteredVideos = videoData.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading videos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-2">
            🎥 Video Gallery
          </h1>
          <p className="text-gray-400">Discover amazing content from our community</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
        </div>

        {/* Video Grid */}
        {filteredVideos.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🎬</div>
            <h2 className="text-2xl font-bold text-gray-300 mb-2">
              {searchTerm ? 'No videos found' : 'No videos available'}
            </h2>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'Check back later for new content!'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <p className="text-gray-400">
                {searchTerm ? `Found ${filteredVideos.length} video${filteredVideos.length !== 1 ? 's' : ''}` : `${filteredVideos.length} video${filteredVideos.length !== 1 ? 's' : ''} available`}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVideos.map((video) => (
                <div
                  key={video._id}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="relative overflow-hidden">
                    <video
                      controls
                      className="w-full h-48 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105 relative z-10"
                      src={video.videoFile}
                      poster={video.thumbnail}
                      title={video.title}
                      onClick={(e) => handleFullScreenAndViews(e.target, video._id)}
                    >
                      Your browser does not support the video tag.
                    </video>

                    {/* Overlay (click-through) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-2 text-white text-sm">
                          <span className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
                            👁️ {video.views || 0}
                          </span>
                          <span className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
                            {new Date(video.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Play button overlay (click-through so video remains clickable) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white truncate mb-2 group-hover:text-purple-300 transition-colors" title={video.title}>
                      {video.title}
                    </h3>

                    <p className="text-sm text-gray-400 line-clamp-2 mb-3">
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
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Video;