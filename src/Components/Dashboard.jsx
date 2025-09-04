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
  const [newTweet, setNewTweet] = useState({ content: '' });
  const [editContent, setEditContent] = useState('');
  const [editingTweet, setEditingTweet] = useState(null);
  const [selectionForm,setSelectionForm] = useState(null);
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
        const response = await axios.get('http://localhost:8000/api/v1/dashboard/stats', {
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
      const response = await axios.get('http://localhost:8000/api/v1/dashboard/videos', {
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
      const res = await axios.get(`http://localhost:8000/api/v1/users/current-user`, {
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
      const response = await axios.get(`http://localhost:8000/api/v1/tweets/user/${userId}`, {
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
      await axios.post('http://localhost:8000/api/v1/videos/getVideo', formData, {
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
      await axios.delete(`http://localhost:8000/api/v1/videos/${videoId}`, {
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
      await axios.patch(`http://localhost:8000/api/v1/videos/${updateForm._id}`, formData, {
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
        'http://localhost:8000/api/v1/tweets/',
        { content: tweet.content },
        {
          withCredentials: true,
        }
      );
      alert("Tweet posted successfully!");
      setShowTweetForm(false);
      setTweet({ content: '' });
      fetchTweets(); // refresh
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

  


  useEffect(() => {
    fetchTweets();
  }, [])
  const handleDeleteTweet = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/tweets/${id}`,
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 p-6 text-white font-sans relative">
      {/* Dashboard Stats */}
      <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-sm shadow-2xl rounded-2xl p-8 space-y-4 border border-white/10">
        <h2 className="text-3xl font-bold text-center text-fuchsia-100 mb-6">📊 Dashboard Stats</h2>
        {data ? (
          <>
            <div className="flex justify-between py-2 border-b border-blue-700"><span>🎥 Videos</span><span>{data.videos}</span></div>
            <div className="flex justify-between py-2 border-b border-blue-700"><span>👥 Subscribers</span><span>{data.subscribers}</span></div>
            <div className="flex justify-between py-2 border-b border-blue-700"><span>❤️ Likes</span><span>{data.likes}</span></div>
            <div className="flex justify-between py-2"><span>👁️ Total Views</span><span>{data.totalViews}</span></div>
          </>
        ) : (
          <p className="text-center text-fuchsia-200">Loading stats...</p>
        )}
      </div>

      {/*Update Account*/}
        <UpdateAccount setActiveForm={setActiveForm} />

      {activeForm === 'fullname' && <FullnameAndEmailForm onClose={closeForm} />}
      {activeForm === 'avatar' && <AvatarForm onClose={closeForm} />}
      {activeForm === 'cover' && <CoverForm onClose={closeForm} />}
        <div>
          <br />
      <h1 className="text-2xl font-bold text-center mt-4">Dashboard</h1>


    </div>

      {/* Upload Button */}
      <div className="flex items-center gap-2 my-6 ml-2 cursor-pointer hover:text-fuchsia-300" onClick={() => setShowUploadForm(true)}>
        <span className="text-lg font-semibold ml-5 hover:underline hover:scale-105 transition-transform duration-150">📤 Upload Video</span>
      </div>
    
      {/* Upload Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white text-gray-900 p-6 rounded-xl w-full max-w-md relative shadow-lg">
            <button className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-red-500 transition" onClick={() => setShowUploadForm(false)}>✕</button>
            <h3 className="text-2xl font-bold mb-5 text-center">📤 Upload New Video</h3>
            <form onSubmit={handleUpload} className="space-y-4">
              <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Video Title" required className="w-full p-2 border rounded-md" />
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Video Description" required className="w-full p-2 border rounded-md" />
              <label className='p-3'>Thumbnail</label>
              <input type="file" name="thumbnail" accept="image/*" onChange={handleChange} required className="w-full p-2" />
              <label className='p-3'>Video</label>
              <input type="file" name="videoFile" accept="video/*" onChange={handleChange} required className="w-full p-2" />
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition">Upload</button>
            </form>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white text-gray-900 p-6 rounded-xl w-full max-w-md relative shadow-lg">
            <button className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-red-500 transition" onClick={() => setShowUpdateForm(false)}>✕</button>
            <h3 className="text-2xl font-bold mb-5 text-center">✏️ Update Video</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input type="text" name="title" value={updateForm.title} onChange={(e) => setUpdateForm((prev) => ({ ...prev, title: e.target.value }))} required className="w-full p-2 border rounded-md" />
              <textarea name="description" value={updateForm.description} onChange={(e) => setUpdateForm((prev) => ({ ...prev, description: e.target.value }))} required className="w-full p-2 border rounded-md" />
              {updateForm.existingThumbnail && <img src={updateForm.existingThumbnail} alt="Current Thumbnail" className="w-32 h-20 object-cover rounded-md border" />}
              <label className="block mt-2">Upload New Thumbnail (Optional)</label>
              <input type="file" name="thumbnail" accept="image/*" onChange={(e) => setUpdateForm((prev) => ({ ...prev, thumbnail: e.target.files[0] }))} className="w-full p-2" />
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition">✅ Update</button>
            </form>
          </div>
        </div>
      )}

      {/* My Videos */}
      <div className="px-4 md:px-6 py-8">
        <h2 className="text-3xl font-semibold mb-6">📹 My Videos</h2>
        {videoData.length === 0 ? (
          <p className="text-gray-400">No videos uploaded yet.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {videoData.map((video) => (
              <div key={video._id} className="bg-white/10 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <video controls className="w-full h-40 object-cover cursor-pointer" src={video.videoFile} poster={video.thumbnail} onClick={(e) => handleFullScreen(e.target)} />
                <div className="p-4">
                  <h3 className="text-lg font-semibold truncate">{video.title}</h3>
                  <p className="text-sm text-gray-300">{video.views} views</p>
                  <p className="text-xs text-gray-400 mb-2">{new Date(video.createdAt).toLocaleDateString()}</p>
                  <button onClick={() => handleDelete(video._id)} className="w-full bg-red-600 hover:bg-red-700 text-white py-1 rounded-lg transition font-medium">🗑️ Delete</button>
                  <button
                    className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white py-1 rounded-lg transition font-medium"
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
                    ✏️ Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Tweet form  */}
      {
        showTweetForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white text-gray-900 p-6 rounded-xl w-full max-w-md relative shadow-lg">
              <button
                className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-red-500 transition"
                onClick={() => setShowTweetForm(false)}
              >
                ✕
              </button>
              <h3 className="text-2xl font-bold mb-5 text-center">🐦 Create Tweet</h3>
              <form onSubmit={handleTweetSubmit} className="space-y-4">
                <textarea
                  name="content"
                  value={tweet.content}
                  onChange={(e) => handleTweetChange(e)}
                  placeholder="What's happening?"
                  required
                  maxLength={280}
                  className="w-full p-2 border rounded-md"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition" onClick={() => handleTweet}>
                  Tweet
                </button>
              </form>
            </div>
          </div>
        )
      }
      {/* My Tweets */}
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 p-6 text-white font-sans relative">

        {/* My Tweets */}
        <div className='px-4 md:px-6 py-8'>
          <div className="flex items-center gap-2 my-6 ml-2 cursor-pointer hover:text-fuchsia-300" onClick={() => setShowTweetForm(true)}>
            <span className="text-lg font-semibold ml-5 hover:underline hover:scale-105 transition-transform duration-150">📤 Create Tweet</span>
          </div>
          <h2 className="text-3xl font-semibold mb-6">🐦 My Tweets</h2>
          {tweetData.length === 0 ? (
            <p className="text-gray-400">No tweets posted yet.</p>
          ) : (
            <div className="space-y-4">
              {tweetData.map((tweet, idx) => (
                <div key={idx} className="bg-white/10 p-4 rounded-lg shadow hover:shadow-md transition relative group">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img src={tweet.owner?.avatar?.url || tweet.owner?.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                      <span className="font-bold text-sm">@{tweet.owner?.username}</span>
                    </div>

                    {/* Edit/Delete Buttons */}
                    {editingTweet && (
                      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                        <div className="bg-white text-gray-900 p-6 rounded-xl w-full max-w-md relative shadow-lg">
                          <button
                            className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-red-500 transition"
                            onClick={() => setEditingTweet(null)}
                          >
                            ✕
                          </button>
                          <h3 className="text-2xl font-bold mb-5 text-center">🐦 Edit Tweet</h3>
                          <form onSubmit={(e) => handleEditTweet(e, editingTweet._id)} className="space-y-4">
                            <textarea
                              name="content"
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              placeholder="What's happening?"
                              required
                              maxLength={280}
                              className="w-full p-2 border rounded-md"
                            />
                            <button
                              type="submit"
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
                            >
                              Save Changes
                            </button>
                          </form>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => {
                          setEditingTweet(tweet);
                          setEditContent(tweet.content);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 rounded-full"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTweet(tweet._id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-full shadow-sm transition-transform transform hover:scale-105"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-white text-sm">{tweet.content}</p>
                  <p className="text-gray-400 text-xs mt-1">{new Date(tweet.createdAt).toLocaleString()}</p>
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
