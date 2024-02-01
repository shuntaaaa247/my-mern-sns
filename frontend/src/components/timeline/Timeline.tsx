import React, { useEffect, useState } from "react";
import {IPost} from "../../../../backend/src/models/Post"
import mongoose from "mongoose";

export default function Timeline() {
  interface IReceivedPost extends IPost {
    _id: mongoose.Types.ObjectId
  }

  const [posts, setPosts] = useState<IReceivedPost[]>([]);

  useEffect(() => {
    
  })

  return(
    <></>
  )
}