import { CommentBody, TweetBody } from "./../../typings.d"
import { sanityClient } from "../../sanity"
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"

type Response = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const data: CommentBody = JSON.parse(req.body)

  const mutations = {
    mutations: [
      {
        create: {
          _type: "comment",
          comment: data.comment,
          username: data.username,
          blockTweet: false,
          profileImage: data.profileImage,
          tweet: {
            _type: "reference",
            _ref: data.tweetId,
          },
        },
      },
    ],
  }
  const apiEndpoint = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`

  const result = await fetch(apiEndpoint, {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`,
    },
    body: JSON.stringify(mutations),
    method: "POST",
  })

  const json = await result.json()
  res.status(200).json({ message: "DONE" })
}
