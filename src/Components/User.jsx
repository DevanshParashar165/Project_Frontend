import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

function User() {
  const [data, setData] = useState(null);
  const [videoData, setVideoData] = useState([]);

  useEffect(() => {
    const handleApi = async () => {
      try {
        const username = Cookies.get('username');
        const response = await axios.get(
          `http://localhost:8000/api/v1/users/channel/${username}`,
          { withCredentials: true }
        );
        setData(response.data);
      } catch (error) {
        console.log('Error:', error);
      }
    };

    handleApi();
  }, []);

  useEffect(() => {
    const channelVideos = async () => {
      try {
        const videoResponse = await axios.get(
          'http://localhost:8000/api/v1/dashboard/videos',
          { withCredentials: true }
        );
        const videos = videoResponse.data?.data?.video || [];
        setVideoData(videos);
      } catch (error) {
        console.log('Error:', error);
      }
    };

    channelVideos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 text-white font-sans">
      {/* Cover + Avatar */}
      {data ? (
        <>
          {/* Cover Image */}
          <div className="w-full aspect-[3/1] overflow-hidden">
            <img
              src={data.data.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Avatar & Info */}
          <div className="flex flex-col items-center -mt-12 relative z-10">
            <Link to="/dashboard">
              <img
                src={data.data.avatar}
                alt="Avatar"
                className="w-28 h-28 rounded-full border-4 border-white shadow-xl bg-white"
              />
            </Link>
            <h1 className="text-2xl font-bold mt-3">{data.data.fullname}</h1>
            <p className="text-sm text-gray-300">@{data.data.username}</p>
          </div>

          {/* Channel Stats */}
          <div className="mt-6 text-center text-gray-300 space-y-1">
            <p>📧 Email: {data.data.email}</p>
            <p>👥 Subscribers: {data.data.subscribersCount}</p>
            <p>🔔 Subscribed To: {data.data.channelsSubscribedToCount}</p>
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-gray-300">Loading user info...</div>
      )}

      {/* My Videos */}
      <div className="px-6 py-10">
        <h2 className="text-3xl font-bold mb-8 text-fuchsia-100 text-center">📹 My Videos</h2>

        {videoData.length === 0 ? (
          <p className="text-center text-gray-400">No videos uploaded yet.</p>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {videoData.map((video) => (
              <div
                key={video._id}
                className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
              >
                <video
                  controls
                  className="w-full h-44 object-cover"
                  src={video.videoFile}
                  poster={video.thumbnail}
                >
                  Your browser does not support the video tag.
                </video>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-fuchsia-100 truncate">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-300">{video.views} views</p>
                  <p className="text-xs text-gray-400">
                    {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default User;
