import React, { useEffect, useState } from "react";
import mongoose from "mongoose";
import "./Timeline.css"
import axios, { AxiosResponse } from "axios";
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

  // profileページ(/profile/:id)の場合、この変数にidが入る。このidによって普通のタイムラインがプロフィールページ用のタイムラインかを分岐する。
  // /profile/:idではなくただの / だった場合(App.tsに記述したpath)、下の変数の中身はundefined
  const urlParams = useParams<{userId: string}>(); 

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let response: AxiosResponse;
        if (!urlParams.userId) {
          response = await axios.get(`/post/timeline/${authState.user?._id.toString()}`); // APIの呼び出し
          console.log("timeline:", response.data);//開発環境デバッグ
        } else {
          response = await axios.get(`/post/profile/timeline/${urlParams.userId.toString()}`); // APIの呼び出し
          console.log("timeline", response.data);//開発環境デバッグ
        }
        console.log("APIの呼び出しはできました。")

        //実際の処理
        // setPosts( 
        //   response.data.sort((post1: IReceivedPost, post2:IReceivedPost) => {
        //     return new Date(post2.createdAt).getTime() - new Date(post1.createdAt).getTime()
        //   })
        // ); 

        //本番環境のデバッグのため、一時的においたコード
        setPosts(response.data)
        // response本体には余分なものが含まれている。responseのdataが欲しいデータ(expressで定義したresponse)。sort()で新しい順にしている
      } catch(err) {
        alert("エラーが発生しました");
        console.log(err);
      }
    }
    fetchPosts();

  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      window.location.reload();
    }
  }, [urlParams.userId]);

  return(
    <div className="Timeline h-full">
      {/* 実際の処理 */}
      {/* {urlParams.userId === undefined  ? <PostShare /> : <ProfileInfo userId={urlParams.userId}/>}

      {posts.map((post: IReceivedPost) => (
        window.location.href.includes("/followers") || window.location.href.includes("/following")
        ? <></>
        : <Post post={post} userId={authState.user?._id ?? null}/>
      ))} */}

      {/* 本番環境用デバッグ */}
      <button onClick={(e) => {console.log(posts)}}>responseの確認</button>
    </div>
  )
}
