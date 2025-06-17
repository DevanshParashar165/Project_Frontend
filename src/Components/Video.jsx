import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Video() {
  const [videoData, setVideoData] = useState([]);

  useEffect(() => {
    const getVideo = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/videos/getVideo`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        });

        const videos = response.data?.data?.videos || []; // Safe access
        setVideoData(videos);
      } catch (error) {
        console.log("Error fetching videos:", error);
      }
    };

    getVideo();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 p-6 text-white font-sans relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
              title={video.title}
            >
              Your browser does not support the video tag.
            </video>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-fuchsia-100 truncate" title={video.title}>
                {video.title}
              </h3>
              <p className="text-sm text-gray-300">{video.views || 0} views</p>
              <p className="text-xs text-gray-400">
                {new Date(video.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Video;
