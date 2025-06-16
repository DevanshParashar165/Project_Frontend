import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Dashboard() {
    const [data, setData] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/v1/dashboard/stats', {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    withCredentials: true // Optional: use only if you’re working with cookies too
   });
                setData(response.data.data);
            } catch (error) {
                console.log("Error while fetching user stats:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-blue-950 p-6 text-white">
            <div className="max-w-xl mx-auto bg-blue-900 shadow-lg rounded-xl p-8 space-y-4">
                <h2 className="text-2xl font-bold text-center text-fuchsia-100 mb-6">📊 Dashboard Stats</h2>
                {data ? (
                    <>
                        <div className="flex justify-between border-b border-blue-800 py-2">
                            <span>🎥 Videos:</span>
                            <span>{data.videos}</span>
                        </div>
                        <div className="flex justify-between border-b border-blue-800 py-2">
                            <span>👥 Subscribers:</span>
                            <span>{data.subscribers}</span>
                        </div>
                        <div className="flex justify-between border-b border-blue-800 py-2">
                            <span>❤️ Likes:</span>
                            <span>{data.likes}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span>👁️ Total Views:</span>
                            <span>{data.totalViews}</span>
                        </div>
                    </>
                ) : (
                    <p className="text-center text-fuchsia-200">Loading stats...</p>
                )}
            </div>
        </div>
    )
}

export default Dashboard
