import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function User() {
  const [data, setData] = useState(null);
  const [videoData, setVideoData] = useState([]);
  const [tweetData, setTweetData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://devconnectbackend-9af9.onrender.com/api/v1/users/channel`, { withCredentials: true });
        setData(response.data);
      } catch (error) {
        console.error('User Fetch Error:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get('https://devconnectbackend-9af9.onrender.com/api/v1/dashboard/videos', { withCredentials: true });
        setVideoData(res.data?.data?.video || []);
      } catch (error) {
        console.error('Video Fetch Error:', error);
      }
    };

    fetchVideos();
  }, []);

  const handleFullScreen = async (videoElement) => {
    if (!document.fullscreenElement) {
      if (videoElement.requestFullscreen) {
        await videoElement.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const res = await axios.get(`https://devconnectbackend-9af9.onrender.com/api/v1/users/current-user`, { withCredentials: true });
        const userId = res.data?.data?._id;
        if (!userId) return console.warn("User ID not found.");

        const tweetsRes = await axios.get(`https://devconnectbackend-9af9.onrender.com/api/v1/tweets/user/${userId}`, { withCredentials: true });
        setTweetData(tweetsRes.data?.data || []);
      } catch (error) {
        console.error('Tweet Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading profile...</p>
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

      <div className="relative z-10">
        {data ? (
          <>
            {/* Cover Image Section */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              {data.data.coverImage ? (
                <div className="relative w-full h-full">
                  <img
                    src={data.data.coverImage?.url || data.data.coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🌟</div>
                    <p className="text-gray-300">No cover image set</p>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Section */}
            <div className="relative px-6 pb-8">
              <div className="max-w-4xl mx-auto">
                {/* Avatar & Basic Info */}
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-20 mb-8">
                  <Link to="/dashboard" className="group">
                    <div className="relative">
                      <img
                        src={data.data.avatar?.url || data.data.avatar}
                        alt="Avatar"
                        className="w-32 h-32 rounded-3xl border-4 border-white/20 shadow-2xl object-cover group-hover:border-purple-500/50 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-slate-900 flex items-center justify-center">
                        <span className="text-xs">✓</span>
                      </div>
                    </div>
                  </Link>

                  <div className="text-center md:text-left flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {data.data.fullname}
                    </h1>
                    <p className="text-xl text-gray-300 mb-4">@{data.data.username}</p>

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
                      <div className="bg-white/5 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10">
                        <span className="text-purple-400 font-semibold">{data.data.subscribersCount}</span>
                        <span className="text-gray-400 ml-1">Subscribers</span>
                      </div>
                      <div className="bg-white/5 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10">
                        <span className="text-blue-400 font-semibold">{data.data.channelsSubscribedToCount}</span>
                        <span className="text-gray-400 ml-1">Following</span>
                      </div>
                      <div className="bg-white/5 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10">
                        <span className="text-green-400 font-semibold">{videoData.length}</span>
                        <span className="text-gray-400 ml-1">Videos</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-12">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">📧</span>
                    <h3 className="text-lg font-semibold">Contact Information</h3>
                  </div>
                  <p className="text-gray-300 flex items-center gap-2">
                    <span className="text-blue-400">✉️</span>
                    {data.data.email}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">👤</div>
            <p className="text-gray-400 text-xl">Loading user information...</p>
          </div>
        )}

        {/* Content Sections */}
        <div className="px-6 max-w-7xl mx-auto">
          {/* Videos Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl">🎥</span>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                My Videos
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-red-400/50 to-transparent"></div>
            </div>

            {videoData.length === 0 ? (
              <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10">
                <div className="text-6xl mb-4">🎬</div>
                <p className="text-gray-400 text-lg">No videos uploaded yet</p>
                <Link
                  to="/dashboard"
                  className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl font-medium hover:shadow-lg hover:scale-105 transition-all"
                >
                  Upload Your First Video
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {videoData.map(video => (
                  <div key={video._id} className="bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:bg-white/10 transition-all group">
                    <div className="relative">
                      <video
                        controls
                        className="w-full h-48 object-cover"
                        src={video.videoFile}
                        poster={video.thumbnail}
                        onClick={(e) => handleFullScreen(e.target)}
                      />
                      {/* <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div> */}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold truncate text-white mb-2">{video.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          👁️ {video.views}
                        </span>
                        <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Tweets Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl">🐦</span>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                My Tweets
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-400/50 to-transparent"></div>
            </div>

            {tweetData.length === 0 ? (
              <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10">
                <div className="text-6xl mb-4">🐦</div>
                <p className="text-gray-400 text-lg">No tweets posted yet</p>
                <Link
                  to="/dashboard"
                  className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl font-medium hover:shadow-lg hover:scale-105 transition-all"
                >
                  Share Your First Tweet
                </Link>
              </div>
            ) : (
              <div className="space-y-4 max-w-3xl mx-auto">
                {tweetData.map((tweet, idx) => (
                  <div key={idx} className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={tweet.owner?.avatar?.url || tweet.owner?.avatar}
                        alt="avatar"
                        className="w-12 h-12 rounded-xl object-cover border-2 border-white/10"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-white">@{tweet.owner?.username}</span>
                          <span className="text-gray-500 text-sm">•</span>
                          <span className="text-gray-400 text-sm">{new Date(tweet.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-white leading-relaxed">{tweet.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default User;