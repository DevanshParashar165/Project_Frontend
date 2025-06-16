import axios from 'axios';
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

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

            const url = isLogin ? 'http://localhost:8000/api/v1/users/login' : 'http://localhost:8000/api/v1/users/register';

            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            const {data} = response.data

            console.log("Login response : ",response)
    
            navigate('/dashboard'); 


        } catch (error) {
            console.error("Registration/Login error:", error);
            alert(error.response?.data?.message || "Something went wrong");
        }
        


    };

    return (
        <div className="min-h-screen bg-blue-950 flex items-center justify-center px-4">
            <div className="w-full max-w-lg bg-blue-900 p-8 rounded-3xl shadow-xl border border-blue-700">
                <div className="flex justify-center mb-6">
                    <button onClick={() => setIsLogin(true)} className={`px-5 py-2 rounded-l-full text-sm font-semibold transition ${isLogin ? 'bg-fuchsia-100 text-blue-950' : 'bg-blue-950 text-fuchsia-100 hover:bg-blue-800'}`}>
                        Login
                    </button>
                    <button onClick={() => setIsLogin(false)} className={`px-5 py-2 rounded-r-full text-sm font-semibold transition ${!isLogin ? 'bg-fuchsia-100 text-blue-950' : 'bg-blue-950 text-fuchsia-100 hover:bg-blue-800'}`}>
                        Register
                    </button>
                </div>

                <h2 className="text-center text-2xl text-fuchsia-100 font-semibold mb-8">
                    {isLogin ? 'Welcome Back 👋' : 'Create Your Account 🚀'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                        <>
                            <div>
                                <label className="block text-fuchsia-200 mb-1">Full Name</label>
                                <input type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} className="w-full px-4 py-2 bg-blue-950 border border-blue-700 rounded-md text-white" placeholder="Enter name" required />
                            </div>
                            <div>
                                <label className="block text-fuchsia-200 mb-1">Username</label>
                                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2 bg-blue-950 border border-blue-700 rounded-md text-white" placeholder="Enter Username" required />
                            </div>
                            <div>
                                <label className="block text-fuchsia-200 mb-1">Avatar</label>
                                <input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files[0])} className="w-full px-4 py-2 bg-blue-950 border border-blue-700 rounded-md text-white file:bg-fuchsia-700 file:text-white file:border-0 file:px-3 file:py-1 file:rounded-md" />
                            </div>
                            <div>
                                <label className="block text-fuchsia-200 mb-1">Cover Image</label>
                                <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} className="w-full px-4 py-2 bg-blue-950 border border-blue-700 rounded-md text-white file:bg-fuchsia-700 file:text-white file:border-0 file:px-3 file:py-1 file:rounded-md" />
                            </div>
                        </>
                    )}
                    <div>
                        <label className="block text-fuchsia-200 mb-1">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 bg-blue-950 border border-blue-700 rounded-md text-white" placeholder="you@example.com" required />
                    </div>
                    <div>
                        <label className="block text-fuchsia-200 mb-1">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 bg-blue-950 border border-blue-700 rounded-md text-white" placeholder="••••••••" required />
                    </div>
                    <button type="submit" className="w-full py-2 bg-fuchsia-100 text-blue-950 font-semibold rounded-lg hover:bg-fuchsia-200 transition">
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginAndRegister;
