import { sanityClient } from "../../sanity"
import type { NextApiRequest, NextApiResponse } from "next"
import { Comment } from "../../typings"
import { groq } from "next-sanity"

const feedQuery = groq`
  *[_type == "comment" && references(*[_type== 'tweet' && _id == $tweetId]._id)] 
  {
    _id,
    ...
  } | order(_createdAt desc)
`

type Response = {
  comments: Comment[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const { tweetId } = req.query
  const comments: Comment[] = await sanityClient.fetch(feedQuery, { tweetId, })
  res.status(200).json({ comments })
}
