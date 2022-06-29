import { RefreshIcon } from "@heroicons/react/outline"
import React, { useState } from "react"
import toast from "react-hot-toast"
import { Tweet } from "../typings"
import { fetchTweets } from "../utils/fetchTweets"
import TweetCompo from "./Tweet"
import TweetBox from "./TweetBox"

interface Props {
  tweets: Tweet[]
}
function Feed({ tweets: tweetsProp }: Props) {
  const [tweets, setTweets] = useState<Tweet[]>(tweetsProp)

  const handleRefresh = async () => {
    const refreshToast = toast.loading("Refreshing...")
    const tweets = await fetchTweets()
    console.log(tweets)
    setTweets(tweets)
    toast.success("Feed Updated!", { id: refreshToast })
  }
  
  return (
    <div className="col-span-7 scrollbar-hide max-h-screen overflow-scroll border-x lg:col-span-5">
      <div className="flex items-center justify-between">
        <h1 className="p-5 pb-0 text-xl font-bold">Home</h1>
        <RefreshIcon
          className="mr-5 mt-5 h-8 w-8 cursor-pointer text-twitter transition-all duration-500 ease-out 
            hover:rotate-180 active:scale-125"
          onClick={handleRefresh}
        />
      </div>

      {/* tweet box */}

      <div>
        <TweetBox setTweets={setTweets} />
      </div>

      <div>
        {tweets.map((tweet) => (
          <TweetCompo key={tweet._id} tweet={tweet} />
        ))}
      </div>
    </div>
  )
}

export default Feed
