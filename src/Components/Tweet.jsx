import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Tweet() {
  const [tweetData, setTweetData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchTweet = async () => {
    try {
      const response = await axios.get("https://devconnectbackend-9af9.onrender.com/api/v1/tweets/", {
        withCredentials: true
      })
      const tweets = response.data?.data || []
      setTweetData(tweets)
    } catch (error) {
      console.log("Error fetching tweets:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTweet()
  }, [])

  const filteredTweets = tweetData.filter(tweet =>
    tweet.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tweet.owner?.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading tweets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            🐦 Tweet Feed
          </h1>
          <p className="text-gray-400">Stay connected with the developer community</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tweets or users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
        </div>

        {/* Tweet Feed */}
        {filteredTweets.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🐦</div>
            <h2 className="text-2xl font-bold text-gray-300 mb-2">
              {searchTerm ? 'No tweets found' : 'No tweets available'}
            </h2>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'Sign in to see tweets from the community!'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <p className="text-gray-400">
                {searchTerm ? `Found ${filteredTweets.length} tweet${filteredTweets.length !== 1 ? 's' : ''}` : `${filteredTweets.length} tweet${filteredTweets.length !== 1 ? 's' : ''} in your feed`}
              </p>
            </div>

            <div className="space-y-4">
              {filteredTweets.map((tweet) => (
                <div key={tweet._id} className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                  {/* Tweet Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      {tweet.owner?.avatar && (
                        <img 
                          src={tweet.owner?.avatar?.url || tweet.owner?.avatar} 
                          alt="avatar" 
                          className="w-12 h-12 rounded-xl object-cover border-2 border-white/10 group-hover:border-blue-500/30 transition-colors" 
                        />
                      )}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white hover:text-blue-300 transition-colors cursor-pointer">
                          @{tweet.owner?.username}
                        </span>
                        <span className="text-gray-500 text-sm">•</span>
                        <span className="text-gray-400 text-sm">
                          {new Date(tweet.createdAt).toLocaleString()}
                        </span>
                      </div>
                      
                      {/* Tweet Content */}
                      <p className="text-white leading-relaxed mb-4 break-words">
                        {tweet.content}
                      </p>
                      
                      {/* Tweet Actions */}
                      <div className="flex items-center gap-6 text-gray-400">
                        <button className="flex items-center gap-2 hover:text-blue-400 transition-colors group/btn">
                          <div className="p-2 rounded-full group-hover/btn:bg-blue-500/10 transition-colors">
                            💬
                          </div>
                          <span className="text-sm">Reply</span>
                        </button>
                        
                        <button className="flex items-center gap-2 hover:text-green-400 transition-colors group/btn">
                          <div className="p-2 rounded-full group-hover/btn:bg-green-500/10 transition-colors">
                            🔄
                          </div>
                          <span className="text-sm">Retweet</span>
                        </button>
                        
                        <button className="flex items-center gap-2 hover:text-red-400 transition-colors group/btn">
                          <div className="p-2 rounded-full group-hover/btn:bg-red-500/10 transition-colors">
                            ❤️
                          </div>
                          <span className="text-sm">Like</span>
                        </button>
                        
                        <button className="flex items-center gap-2 hover:text-purple-400 transition-colors group/btn">
                          <div className="p-2 rounded-full group-hover/btn:bg-purple-500/10 transition-colors">
                            📤
                          </div>
                          <span className="text-sm">Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Tweet