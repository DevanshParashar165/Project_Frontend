import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

function User() {
  const [data, setData] = useState(null);
  const [videoData, setVideoData] = useState([]);
  const [tweetData, setTweetData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://devconnectbackend-9af9.onrender.com/api/v1/users/channel`, { withCredentials: true });
        setData(response.data);
        console.log(response.data)
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
      }
    };

    fetchTweets();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 text-white px-4 py-6">
      {data ? (
        <>
          {/* Cover Image */}
          {
            data.data.coverImage ? (<div className="w-full h-48 rounded-xl overflow-hidden shadow-xl">
            <img src={data.data.coverImage?.url || data.data.coverImage} alt="Cover" className="w-full h-full object-cover" />
          </div>) : (<div className="w-full h-48 rounded-xl overflow-hidden shadow-xl">
           
          </div>)
          }

          {/* Avatar & Info */}
          <div className="flex flex-col items-center -mt-14 z-10">
            <Link to="/dashboard">
              <img src={data.data.avatar?.url||data.data.avatar} alt="Avatar" className="w-28 h-28 rounded-full border-4 border-white shadow-lg" />
            </Link>
            <h1 className="text-2xl font-bold mt-3">{data.data.fullname}</h1>
            <p className="text-sm text-gray-300">@{data.data.username}</p>
          </div>

          {/* Stats */}
          <div className="mt-6 text-center bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg max-w-md mx-auto">
            <p className="text-sm">📧 Email: {data.data.email}</p>
            <p className="text-sm">👥 Subscribers: {data.data.subscribersCount}</p>
            <p className="text-sm">🔔 Subscribed To: {data.data.channelsSubscribedToCount}</p>
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-gray-300">Loading user info...</div>
      )}

      {/* Videos */}
      <section className="py-10">
        <h2 className="text-3xl font-bold text-center text-fuchsia-100 mb-6">📹 My Videos</h2>
        {videoData.length === 0 ? (
          <p className="text-center text-gray-400">No videos uploaded yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {videoData.map(video => (
              <div key={video._id} className="bg-white/10 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition">
                <video controls className="w-full h-40 object-cover" src={video.videoFile} poster={video.thumbnail} />
                <div className="p-3">
                  <h3 className="font-semibold truncate text-fuchsia-100">{video.title}</h3>
                  <p className="text-sm text-gray-300">{video.views} views</p>
                  <p className="text-xs text-gray-400">{new Date(video.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Tweets */}
      <section className="py-6">
        <h2 className="text-3xl font-bold text-center text-fuchsia-100 mb-6">🐦 My Tweets</h2>
        {tweetData.length === 0 ? (
          <p className="text-center text-gray-400">No tweets posted yet.</p>
        ) : (
          <div className="space-y-4 max-w-2xl mx-auto">
            {tweetData.map((tweet, idx) => (
              <div key={idx} className="bg-white/10 p-4 rounded-lg shadow hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-2">
                  <img src={tweet.owner?.avatar?.url || tweet.owner?.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                  <span className="font-bold text-sm text-white">@{tweet.owner?.username}</span>
                </div>
                <p className="text-white text-sm">{tweet.content}</p>
                <p className="text-gray-400 text-xs mt-1">{new Date(tweet.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default User;