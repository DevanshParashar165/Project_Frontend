import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FullnameAndEmailForm from './Forms/FullnameAndEmailForm.jsx';
import UpdateAccount from './Button/UpdateAccount.jsx';
import CoverForm from './Forms/CoverForm.jsx';
import AvatarForm from './Forms/AvatarForm.jsx';

function Dashboard() {
  const [data, setData] = useState(null);
  const [videoData, setVideoData] = useState([]);
  const [tweetData, setTweetData] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showTweetForm, setShowTweetForm] = useState(false);
  const [tweet, setTweet] = useState({ content: '' });
  const [editContent, setEditContent] = useState('');
  const [editingTweet, setEditingTweet] = useState(null);
  const [activeForm, setActiveForm] = useState(null);

  const closeForm = () => setActiveForm(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    thumbnail: null,
    videoFile: null,
  });

  const [updateForm, setUpdateForm] = useState({
    _id: '',
    title: '',
    description: '',
    thumbnail: null,
    existingThumbnail: '',
  });

  // Fetch Dashboard Stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://devconnectbackend-9af9.onrender.com/api/v1/dashboard/stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        });
        setData(response.data.data);
      } catch (error) {
        console.log('Error while fetching user stats:', error);
      }
    };
    fetchData();
  }, []);

  // Fetch Channel Videos
  const fetchVideos = async () => {
    try {
      const response = await axios.get('https://devconnectbackend-9af9.onrender.com/api/v1/dashboard/videos', {
        withCredentials: true,
      });
      setVideoData(response.data?.data?.video || []);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  // Fetch My Tweets
  const fetchTweets = async () => {
    let userId = null;
    try {
      const res = await axios.get(`https://devconnectbackend-9af9.onrender.com/api/v1/users/current-user`, {
        withCredentials: true,
      });
      const user = res.data;
      userId = user?.data?._id;
      if (!userId) return console.error("User ID not found in response");
      console.log("Current User ID:", userId);
    } catch (error) {
      return console.error("Error fetching current user:", error);
    }

    try {
      const response = await axios.get(`https://devconnectbackend-9af9.onrender.com/api/v1/tweets/user/${userId}`, {
        withCredentials: true,
      });

      const tweets = response.data?.data || [];
      setTweetData(tweets);
    } catch (error) {
      console.log("Error fetching tweets:", error);
    }
  };

  useEffect(() => {
    fetchVideos();
    fetchTweets();
  }, []);

  // Fullscreen Video
  const handleFullScreen = (videoElement) => {
    if (videoElement.requestFullscreen) {
      videoElement.requestFullscreen();
    }
  };

  const handleChange = (e) => {
    const { name, files, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('thumbnail', form.thumbnail);
    formData.append('videoFile', form.videoFile);

    try {
      await axios.post('https://devconnectbackend-9af9.onrender.com/api/v1/videos/getVideo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });

      alert('Video uploaded successfully!');
      setShowUploadForm(false);
      setForm({ title: '', description: '', thumbnail: null, videoFile: null });
      fetchVideos();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload video.');
    }
  };

  const handleDelete = async (videoId) => {
    try {
      await axios.delete(`https://devconnectbackend-9af9.onrender.com/api/v1/videos/${videoId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });
      setVideoData((prev) => prev.filter((v) => v._id !== videoId));
    } catch (error) {
      console.log('Error:', error);
      alert('Failed to delete video.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', updateForm.title);
    formData.append('description', updateForm.description);
    if (updateForm.thumbnail) {
      formData.append('thumbnail', updateForm.thumbnail);
    }

    try {
      await axios.patch(`https://devconnectbackend-9af9.onrender.com/api/v1/videos/${updateForm._id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      alert('Video updated successfully!');
      setShowUpdateForm(false);
      fetchVideos();
    } catch (error) {
      console.log('Error updating video:', error);
      alert('Failed to update video.');
    }
  };

  const handleTweetSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'https://devconnectbackend-9af9.onrender.com/api/v1/tweets/',
        { content: tweet.content },
        {
          withCredentials: true,
        }
      );
      alert("Tweet posted successfully!");
      setShowTweetForm(false);
      setTweet({ content: '' });
      fetchTweets();
    } catch (error) {
      console.log("Error : ", error);
      alert("Tweet failed!");
    }
  };

  const handleTweetChange = (e) => {
    setTweet((prev) => ({
      ...prev,
      content: e.target.value,
    }));
  }

  const handleDeleteTweet = async (id) => {
    try {
      await axios.delete(`https://devconnectbackend-9af9.onrender.com/api/v1/tweets/${id}`,
        {
          withCredentials: true
        }
      )
      setTweetData((prev) => prev.filter((t) => t._id !== id))
      alert("Tweet Deleted Successfully!!")
    } catch (error) {
      console.log("Error : ", error)
    }
  }

  const handleEditTweet = async (e, tweetId) => {
    e.preventDefault();
    try {
      await axios.patch(`https://devconnectbackend-9af9.onrender.com/api/v1/tweets/${tweetId}`, 
        { content: editContent },
        { withCredentials: true }
      );
      setEditingTweet(null);
      setEditContent('');
      fetchTweets();
      alert("Tweet updated successfully!");
    } catch (error) {
      console.log("Error updating tweet:", error);
      alert("Failed to update tweet.");
    }
  };

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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-gray-400">Manage your content and track your progress</p>
        </div>

        {/* Dashboard Stats */}
        <div className="mb-12">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
              📊 <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Analytics Overview</span>
            </h2>
            {data ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Videos', value: data.videos, icon: '🎥', color: 'from-red-500 to-pink-500' },
                  { label: 'Subscribers', value: data.subscribers, icon: '👥', color: 'from-blue-500 to-cyan-500' },
                  { label: 'Likes', value: data.likes, icon: '❤️', color: 'from-pink-500 to-rose-500' },
                  { label: 'Total Views', value: data.totalViews, icon: '👁️', color: 'from-purple-500 to-indigo-500' },
                ].map((stat, index) => (
                  <div key={index} className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                    <div className="text-center">
                      <div className="text-3xl mb-2">{stat.icon}</div>
                      <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                        {stat.value}
                      </div>
                      <div className="text-gray-400 text-sm">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full mx-auto mb-4"></div>
                <p className="text-gray-400">Loading analytics...</p>
              </div>
            )}
          </div>
        </div>

        {/* Update Account Section */}
        <div className="mb-12">
          <UpdateAccount setActiveForm={setActiveForm} />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-12 justify-center">
          <button
            onClick={() => setShowUploadForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl font-medium hover:shadow-lg hover:scale-105 transition-all"
          >
            📤 Upload Video
          </button>
          <button
            onClick={() => setShowTweetForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl font-medium hover:shadow-lg hover:scale-105 transition-all"
          >
            🐦 Create Tweet
          </button>
        </div>

        {/* Forms */}
        {activeForm === 'fullname' && <FullnameAndEmailForm onClose={closeForm} />}
        {activeForm === 'avatar' && <AvatarForm onClose={closeForm} />}
        {activeForm === 'cover' && <CoverForm onClose={closeForm} />}

        {/* Upload Modal */}
        {showUploadForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800/90 backdrop-blur-xl text-white p-8 rounded-3xl w-full max-w-md border border-white/10 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">📤 Upload Video</h3>
                <button 
                  onClick={() => setShowUploadForm(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleUpload} className="space-y-4">
                <input 
                  type="text" 
                  name="title" 
                  value={form.title} 
                  onChange={handleChange} 
                  placeholder="Video Title" 
                  required 
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                />
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange} 
                  placeholder="Video Description" 
                  required 
                  rows="3"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" 
                />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Thumbnail</label>
                  <input 
                    type="file" 
                    name="thumbnail" 
                    accept="image/*" 
                    onChange={handleChange} 
                    required 
                    className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-500/30" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Video File</label>
                  <input 
                    type="file" 
                    name="videoFile" 
                    accept="video/*" 
                    onChange={handleChange} 
                    required 
                    className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-500/20 file:text-blue-300 hover:file:bg-blue-500/30" 
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all"
                >
                  Upload Video
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tweet Modal */}
        {showTweetForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800/90 backdrop-blur-xl text-white p-8 rounded-3xl w-full max-w-md border border-white/10 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">🐦 Create Tweet</h3>
                <button 
                  onClick={() => setShowTweetForm(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleTweetSubmit} className="space-y-4">
                <textarea
                  name="content"
                  value={tweet.content}
                  onChange={handleTweetChange}
                  placeholder="What's happening?"
                  required
                  maxLength={280}
                  rows="4"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>{tweet.content.length}/280</span>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all"
                >
                  Tweet
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Update Modal */}
        {showUpdateForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800/90 backdrop-blur-xl text-white p-8 rounded-3xl w-full max-w-md border border-white/10 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">✏️ Update Video</h3>
                <button 
                  onClick={() => setShowUpdateForm(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleUpdate} className="space-y-4">
                <input 
                  type="text" 
                  name="title" 
                  value={updateForm.title} 
                  onChange={(e) => setUpdateForm((prev) => ({ ...prev, title: e.target.value }))} 
                  required 
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500" 
                />
                <textarea 
                  name="description" 
                  value={updateForm.description} 
                  onChange={(e) => setUpdateForm((prev) => ({ ...prev, description: e.target.value }))} 
                  required 
                  rows="3"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" 
                />
                {updateForm.existingThumbnail && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Current Thumbnail</label>
                    <img src={updateForm.existingThumbnail} alt="Current Thumbnail" className="w-full h-32 object-cover rounded-xl border border-white/10" />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">New Thumbnail (Optional)</label>
                  <input 
                    type="file" 
                    name="thumbnail" 
                    accept="image/*" 
                    onChange={(e) => setUpdateForm((prev) => ({ ...prev, thumbnail: e.target.files[0] }))} 
                    className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-500/30" 
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all"
                >
                  ✅ Update Video
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Edit Tweet Modal */}
        {editingTweet && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800/90 backdrop-blur-xl text-white p-8 rounded-3xl w-full max-w-md border border-white/10 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">✏️ Edit Tweet</h3>
                <button 
                  onClick={() => setEditingTweet(null)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={(e) => handleEditTweet(e, editingTweet._id)} className="space-y-4">
                <textarea
                  name="content"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="What's happening?"
                  required
                  maxLength={280}
                  rows="4"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>{editContent.length}/280</span>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all"
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}

        {/* My Videos */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            🎥 <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">My Videos</span>
          </h2>
          {videoData.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-3xl border border-white/10">
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-gray-400 text-lg">No videos uploaded yet</p>
              <p className="text-gray-500 text-sm">Upload your first video to get started!</p>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {videoData.map((video) => (
                <div key={video._id} className="bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:bg-white/10 transition-all group">
                  <div className="relative">
                    <video 
                      controls 
                      className="w-full h-48 object-cover cursor-pointer" 
                      src={video.videoFile} 
                      poster={video.thumbnail} 
                      onClick={(e) => handleFullScreen(e.target)} 
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold truncate mb-2">{video.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        👁️ {video.views}
                      </span>
                      <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDelete(video._id)} 
                        className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 py-2 rounded-xl transition-all font-medium"
                      >
                        🗑️ Delete
                      </button>
                      <button
                        className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 py-2 rounded-xl transition-all font-medium"
                        onClick={() => {
                          setUpdateForm({
                            _id: video._id,
                            title: video.title,
                            description: video.description,
                            thumbnail: null,
                            existingThumbnail: video.thumbnail,
                          });
                          setShowUpdateForm(true);
                        }}
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Tweets */}
        <div>
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            🐦 <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">My Tweets</span>
          </h2>
          {tweetData.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-3xl border border-white/10">
              <div className="text-6xl mb-4">🐦</div>
              <p className="text-gray-400 text-lg">No tweets posted yet</p>
              <p className="text-gray-500 text-sm">Share your thoughts with the world!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tweetData.map((tweet, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={tweet.owner?.avatar?.url || tweet.owner?.avatar} 
                        alt="avatar" 
                        className="w-12 h-12 rounded-xl object-cover border-2 border-white/10" 
                      />
                      <div>
                        <span className="font-semibold text-white">@{tweet.owner?.username}</span>
                        <p className="text-gray-400 text-sm">{new Date(tweet.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingTweet(tweet);
                          setEditContent(tweet.content);
                        }}
                        className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-xl transition-all"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteTweet(tweet._id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl transition-all"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-white leading-relaxed">{tweet.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;