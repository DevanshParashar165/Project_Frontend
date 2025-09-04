import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginAndRegister() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!(email.endsWith('@gmail.com')||email.endsWith('@outlook.com'))){
      alert("Email is not valid")
    }

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      if (!isLogin) {
        formData.append('username', username);
        formData.append('fullname', fullname);
        formData.append('avatar', avatar);
        formData.append('coverImage', coverImage);
      }

      const url = isLogin
        ? 'http://localhost:8000/api/v1/users/login'
        : 'http://localhost:8000/api/v1/users/register';

      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      console.log("Auth response:", response.data);

      navigate('/videos');
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-md text-white p-8 rounded-3xl shadow-2xl border border-white/10 transition-all">
        {/* Toggle Buttons */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-6 py-2 rounded-l-full font-medium transition-all duration-300 ${
              isLogin
                ? 'bg-fuchsia-100 text-blue-900'
                : 'bg-transparent border border-fuchsia-100 text-fuchsia-100 hover:bg-fuchsia-100 hover:text-blue-900'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-6 py-2 rounded-r-full font-medium transition-all duration-300 ${
              !isLogin
                ? 'bg-fuchsia-100 text-blue-900'
                : 'bg-transparent border border-fuchsia-100 text-fuchsia-100 hover:bg-fuchsia-100 hover:text-blue-900'
            }`}
          >
            Register
          </button>
        </div>

        <h2 className="text-center text-2xl font-bold mb-8">
          {isLogin ? '👋 Welcome Back' : '🚀 Create Your Account'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <>
              <div>
                <label className="block mb-1 text-fuchsia-200">Full Name</label>
                <input
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-300"
                  placeholder="Enter FullName"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-fuchsia-200">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-300"
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-fuchsia-200">Avatar</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatar(e.target.files[0])}
                  className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-fuchsia-700 file:text-white hover:file:bg-fuchsia-600"
                />
              </div>
              <div>
                <label className="block mb-1 text-fuchsia-200">Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImage(e.target.files[0])}
                  className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-fuchsia-700 file:text-white hover:file:bg-fuchsia-600"
                />
              </div>
            </>
          )}

          <div>
            <label className="block mb-1 text-fuchsia-200">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-300"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-fuchsia-200">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-300"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-fuchsia-100 text-blue-950 font-bold rounded-lg shadow hover:bg-fuchsia-200 transition duration-300 cursor-pointer"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginAndRegister;
