import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Tweet() {
  const [tweetData, setTweetData] = useState([])

  const fetchTweet = async () => {
    try {
      const response = await axios.get("https://devconnectbackend-9af9.onrender.com/api/v1/tweets/", {
        withCredentials: true
      })
      const tweets = response.data?.data || []
      setTweetData(tweets)
    } catch (error) {
      console.log("Error fetching tweets:", error)
    }
  }

  useEffect(() => {
    fetchTweet()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-900 flex items-center justify-center px-4 py-8">
      <section className="py-6 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-fuchsia-100 mb-6">🐦 Tweets</h2>
        {tweetData.length === 0 ? (
          <p className="text-center text-gray-400">Sign In to see tweets.</p>
        ) : (
          <div className="space-y-4">
            {tweetData.map((tweet) => (
              <div key={tweet._id} className="bg-white/10 p-4 rounded-lg shadow hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-2">
                  {tweet.owner?.avatar && (
                    <img src={tweet.owner?.avatar?.url || tweet.owner?.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                  )}
                  <span className="font-bold text-sm text-white">
                    @{tweet.owner?.username}
                  </span>
                </div>
                <p className="text-white text-sm">{tweet.content}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(tweet.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Tweet
