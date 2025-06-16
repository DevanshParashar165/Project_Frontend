import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { NavLink, Link } from 'react-router-dom';

function User() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const handleApi = async () => {
      try {
        const username = Cookies.get("username");
        const response = await axios.get(`http://localhost:8000/api/v1/users/channel/${username}`,
          {
            withCredentials: true,
          }
        );
        setData(response.data); // direct access to the actual user data
      } catch (error) {
        console.log("Error:", error);
      }
    };

    handleApi();
  }, []);

  return (
    <div className="bg-blue-950 min-h-screen text-white font-sans">
      {data ? (
        <>
          {/* Cover Image */}
          <div className="w-full aspect-[3/1]">
            <img
              src={data.data.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Avatar & Info Section */}
          <div className="flex flex-col items-center gap-2 py-6">
            <Link to='/dashboard' className='cursor-pointer'>
              <img
                src={data.data.avatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full border-4 border-white shadow-md"
              />
            </Link>
            <h1 className="text-xl font-bold">{data.data.fullname}</h1>
            <p className="text-sm text-gray-300">@{data.data.username}</p>
          </div>

          {/* Stats Section */}
          <div className="max-w-md mx-auto text-center space-y-1 text-gray-300">
            <p>📬 Email: {data.data.email}</p>
            <p>👥 Subscribers: {data.data.subscribersCount}</p>
            <p>📺 Subscribed To: {data.data.channelsSubscribedToCount}</p>
          </div>
          <br />
        </>
      ) : (
        <div className="p-10 text-center">Loading...</div>
      )}
    </div>
  );
}

export default User;
