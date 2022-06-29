import React, { useEffect, useState } from "react"
import { Comment, CommentBody, Tweet } from "../typings"
import TimeAgo from "react-timeago"
import {
  ChatAlt2Icon,
  HeartIcon,
  SwitchHorizontalIcon,
  UploadIcon,
} from "@heroicons/react/outline"
import { fetchComments } from "../utils/fetchComments"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"

interface Props {
  tweet: Tweet
}

function Tweet({ tweet }: Props) {
  const [comments, setComments] = useState<Comment[]>([])
  const [commentBoxVisible, setCommentBoxVisible] = useState<boolean>(false)
  const [input, setInput] = useState("")
  const { data: session } = useSession()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const commentInfo: CommentBody = {
      comment: input,
      username: session?.user?.name || "Unknown user",
      profileImage: session?.user?.image || "",
      tweetId: tweet._id,
    }

    const refreshToast = toast.loading("Posting Comment...")
    const result = await fetch("api/addComment", {
      body: JSON.stringify(commentInfo),
      method: "POST",
    })

    const json = await result.json()

    console.log("ADD COMMENT", json)
    refreshComments()
    toast.success("Comment Posted!", { id: refreshToast })

    setInput("")
    setCommentBoxVisible(false)
    return json
  }

  const refreshComments = async () => {
    const comments: Comment[] = await fetchComments(tweet._id)
    setComments(comments)
  }

  useEffect(() => {
    refreshComments()
  }, [])

  return (
    <div className="flex flex-col space-x-3 border-y border-gray-100 p-5">
      <div className="flex space-x-3">
        <img
          className="h-10 w-10 rounded-full object-cover"
          src={tweet.profileImage}
          alt=""
        />

        <div className="">
          <div className="flex items-center space-x-1">
            <p className="mr-1 font-bold">{tweet.username}</p>
            <p className="hidden text-sm text-gray-500 sm:inline">
              @{tweet.username.replace(/\s+/g, "").toLowerCase()} ·
            </p>
            <TimeAgo
              className="text-sm text-gray-500"
              date={tweet._createdAt}
            />
          </div>
          <p className="pt-1">{tweet.text}</p>
          {tweet.image && (
            <img
              className="m-5 ml-0 mb-1 max-h-60 rounded-lg object-cover shadow-sm"
              src={tweet.image}
              alt=""
            />
          )}
        </div>
      </div>
      <div className="mt-5 flex justify-between">
        <div
          onClick={() => session && setCommentBoxVisible(!commentBoxVisible)}
          className="flex cursor-pointer items-center space-x-3 text-gray-400"
        >
          <ChatAlt2Icon className="h-5 w-5" />
          <p>{comments?.length}</p>
        </div>
        <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
          <SwitchHorizontalIcon className="h-5 w-5" />
        </div>
        <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
          <HeartIcon className="h-5 w-5" />
        </div>
        <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
          <UploadIcon className="h-5 w-5" />
        </div>
      </div>

      {commentBoxVisible && (
        <form onSubmit={handleSubmit} className="mt-3 flex space-x-3" action="">
          <input
            className="flex-1 rounded-lg bg-gray-100 p-2 outline-none"
            type="text"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            placeholder="Write a comment..."
          />
          <button
            disabled={!input}
            className="text-twitter disabled:text-gray-200"
            type="submit"
          >
            Post
          </button>
        </form>
      )}

      {comments?.length > 0 && (
        <div className="my-2 mt-5 max-h-44 space-y-5 overflow-y-scroll border-t border-gray-100 p-5">
          {comments.map((comment) => (
            <div key={comment._id} className="relative flex space-x-2">
              <hr className="absolute top-10 left-5 h-8   border-x border-twitter/30" />
              <img
                className="mt-2 h-7 w-7 rounded-full object-cover"
                src={comment.profileImage}
                alt=""
              />
              <div>
                <div className="flex items-center space-x-1">
                  <p className="mr-1 hidden font-bold text-gray-500 lg:inline">
                    {comment.username}
                  </p>
                  <p>@{comment.username.replace(/\s+/g, "").toLowerCase()}</p>
                  <TimeAgo
                    className="text-sm text-gray-500"
                    date={comment._createdAt}
                  />
                </div>
                <p>{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Tweet
