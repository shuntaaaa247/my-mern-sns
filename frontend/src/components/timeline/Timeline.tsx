import React, { useEffect, useState } from "react";
// import mongoose, { Date } from "mongoose";
import mongoose from "mongoose";
import "./Timeline.css"
import axios, { Axios, AxiosResponse } from "axios";
import { useContext } from "react";
import { AuthContext } from "../../state/AuthContext";
import Post from "../post/Post";
import PostShare from "../postShare/PostShare";
import { useParams } from 'react-router-dom';
import ProfileInfo from "../profileInfo/ProfileInfo";

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
  // const [urlParams, setUrlParams] = useState(undefined);

  // profileページ(/profile/:id)の場合、この変数にidが入る。このidによって普通のタイムラインがプロフィールページ用のタイムラインかを分岐する。
  // /profile/:idではなくただの / だった場合(App.tsに記述したpath)、下の変数の中身はundefined
  const urlParams = useParams<{userId: string}>(); 

  useEffect(() => {
    const fetchPosts = async () => {
      let response: AxiosResponse;
      if (!urlParams.userId) {
        response = await axios.get(`/post/timeline/${authState.user?._id.toString()}`); // APIの呼び出し
      } else {
        response = await axios.get(`/post/profile/timeline/${urlParams.userId.toString()}`); // APIの呼び出し
      }
      setPosts(
        response.data.sort((post1: IReceivedPost, post2:IReceivedPost) => {
          return new Date(post2.createdAt).getTime() - new Date(post1.createdAt).getTime()
        })
      ); // response本体には余分なものが含まれている。responseのdataが欲しいデータ(expressで定義したresponse)。sort()で新しい順にしている
    }
    fetchPosts();

  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      window.location.reload();
    }
  }, [urlParams.userId])

  return(
    <div className="Timeline h-full">
      {urlParams.userId === undefined ? <PostShare /> : <ProfileInfo userId={urlParams.userId}/>}
      
      {posts.map((post: IReceivedPost) => (
        <Post post={post} userId={authState.user?._id ?? null}/>
      ))}
      {authState.user 
        ? <h1>{authState.user?._id.toString()}</h1>
        : "aaa"
      }
    </div>
  )
}