import React, { useEffect, useState } from "react";
// import mongoose, { Date } from "mongoose";
import mongoose from "mongoose";
import "./Timeline.css"
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../state/AuthContext";
import Post from "../post/Post";
import PostShare from "../postShare/PostShare";

export interface IPost {
  auther: mongoose.Types.ObjectId,
  description: string,
  img: string,
  likes: mongoose.Types.ObjectId[] //likeを押したユーザーのidが格納される
}

export interface IReceivedPost extends IPost {
  _id: mongoose.Types.ObjectId,
  auther: mongoose.Types.ObjectId,
  description: string,
  img: string,
  likes: mongoose.Types.ObjectId[],
  createdAt: Date,
}

export default function Timeline() {
  const { state: authState, dispatch, } = useContext(AuthContext);

  const [posts, setPosts] = useState<IReceivedPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      console.log("authState.user?._id.toString() = ")
      console.log(authState.user?._id.toString());
      console.log(`/post/timeline/${authState.user?._id.toString()})`)
      const response = await axios.get(`/post/timeline/${authState.user?._id.toString()}`); // APIの呼び出し
      // const response = await axios.get(`/post/timeline/65b7a86182b55669de535476`); // APIの呼び出し
      // setPosts(response.data);
      setPosts(
        response.data.sort((post1: IReceivedPost, post2:IReceivedPost) => {
          return new Date(post2.createdAt).getTime() - new Date(post1.createdAt).getTime()
        })
      ); // response本体には余分なものが含まれている。responseのdataが欲しいデータ(expressで定義したresponse)。sort()で新しい順にしている
    }
    fetchPosts();
  }, []);
  return(
    <div className="Timeline h-full">
      <PostShare />
      
      {posts.map((post: IReceivedPost) => (
        <Post post={post} userId={authState.user?._id ?? null}/>
      ))}
      {/* {JSON.stringify(posts)} */}
      {authState.user 
        ? <h1>{authState.user?._id.toString()}</h1>
        : "aaa"
      }
    </div>
  )
}