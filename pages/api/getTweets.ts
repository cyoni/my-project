import { sanityClient } from "../../sanity"
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import { Tweet } from "../../typings"
import { groq } from "next-sanity"

const feedQuery = groq`
  *[_type == "tweet" && !blockTweet] {
    _id,
    ...
  } | order(_createdAt desc)
`

type Response = {
  tweets: Tweet[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const tweets: Tweet[] = await sanityClient.fetch(feedQuery)
  res.status(200).json({ tweets })
}
