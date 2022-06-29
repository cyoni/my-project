import {
  CalculatorIcon,
  EmojiHappyIcon,
  LocationMarkerIcon,
  PhotographIcon,
  SearchCircleIcon,
} from "@heroicons/react/outline"
import { useSession } from "next-auth/react"
import React, { Dispatch, SetStateAction, useRef, useState } from "react"
import toast from "react-hot-toast"
import { Tweet, TweetBody } from "../typings"
import { fetchTweets } from "../utils/fetchTweets"

interface Props {
  setTweets: Dispatch<SetStateAction<Tweet[]>>
}

function TweetBox({ setTweets }: Props) {
  const [input, setInput] = useState<string>("")
  const { data: session } = useSession()
  const [imageUrlBoxIsOpen, setImageUrlBoxIsOpen] = useState<boolean>(false)
  const [image, setImage] = useState<string>("")
  const imageInputRef = useRef<HTMLInputElement>(null)
  
  const addImageToTweet = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()
    if (!imageInputRef.current?.value) return
    setImage(imageInputRef.current.value)
    setImageUrlBoxIsOpen(false)
  }

  const postTweet = async () => {
    const tweetInfo: TweetBody = {
      text: input,
      username: session?.user?.name || "Unknown user",
      profileImage: session?.user?.image || "",
      image,
    }

    const refreshToast = toast.loading("Posting Tweet...")
    const result = await fetch("api/addTweet", {
      body: JSON.stringify(tweetInfo),
      method: "POST",
    })
    const json = await result.json()
    console.log("ADD TWEET", json)

    const newTweets = await fetchTweets()
    setTweets(newTweets)

    toast.success("Tweet Posted!", { id: refreshToast })
    setInput("")
    setImage("")
    setImageUrlBoxIsOpen(false)
    return json
  }

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    postTweet()
  }
  return (
    <div className="flex p-5">
      <img
        className="mt-4 h-14 w-14 rounded-full object-cover "
        src={
          session?.user?.image ||
          "https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"
        }
        alt=""
      />

      <div className="flex flex-1 items-center pl-2">
        <form className="flex flex-1 flex-col">
          <input
            className="h-24 w-full text-xl outline-none placeholder:text-xl"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What's happening?"
          />
          <div className="flex items-center">
            <div className="flex flex-1 space-x-2 text-twitter">
              <PhotographIcon
                onClick={() => setImageUrlBoxIsOpen(!imageUrlBoxIsOpen)}
                className="h-5 w-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150"
              />
              <SearchCircleIcon className="h-5 w-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150" />
              <EmojiHappyIcon className="h-5 w-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150" />
              <CalculatorIcon className="h-5 w-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150" />
              <LocationMarkerIcon className="hover:scale-150\ h-5 w-5 cursor-pointer transition-transform duration-150 ease-out" />
            </div>
            <button
              disabled={!input || !session}
              onClick={handleSubmit}
              className="rounded-full bg-twitter px-5 py-2 font-bold text-white disabled:opacity-40"
            >
              Tweet
            </button>
          </div>
          {imageUrlBoxIsOpen && (
            <form className="mt-5 flex rounded-lg bg-twitter/80 py-2 px-4">
              <input
                ref={imageInputRef}
                className="flex-1 bg-transparent p-2 text-white outline-none placeholder:text-white"
                type="text"
                placeholder="Enter Image URL..."
              />
              <button
                onClick={addImageToTweet}
                type="submit"
                className="font-bold text-white"
              >
                Add Image
              </button>
            </form>
          )}
          {image && (
            <img
              src={image}
              className="mt-10 h-40 w-full rounded-lg object-contain shadow-lg"
              alt=""
            />
          )}
        </form>
      </div>
    </div>
  )
}

export default TweetBox
