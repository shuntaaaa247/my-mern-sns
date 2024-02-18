import React, { useEffect, useState } from "react";
import "./SearchResult.css";
import { IReceivedPost } from "../timeline/Timeline";
import axios from "axios";
import Post from "../post/Post";
import { useContext } from "react";
import { AuthContext } from "../../state/AuthContext";
import { IReceivedUser } from "../profileInfo/ProfileInfo";
import { User } from "../user/User";


export const SearchResult = () => {
  const { state: authState, dispatch, } = useContext(AuthContext);
  const [fetchedPosts, setFetchedPost] = useState<IReceivedPost[]>([]);
  const [fetchedUsers, setFetchedUsers] = useState<IReceivedUser[]>([]);
  const [mode, setMode] = useState<string>("posts");
  const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        //本番環境用
        //const response = await axios.get(`/post/search/post_search?text=${window.location.href.split("search?text=")[1]}`);

        //本番環境用デバッグ
        const response = await axios.get(`${backendBaseUrl}/post/search/post_search?text=${window.location.href.split("search?text=")[1]}`);
        setFetchedPost(response.data);
      } catch(err) {
        alert("エラーが発生しました");
        console.log(err);
      }
    }

    const fetchUsers = async () => {
      try {
        //本番環境用
        //const response = await axios.get(`/user/search/user_search?text=${window.location.href.split("search?text=")[1]}`)

        //本番環境用デバッグ
        const response = await axios.get(`${backendBaseUrl}/user/search/user_search?text=${window.location.href.split("search?text=")[1]}`)
        setFetchedUsers(response.data)
      } catch(err) {
        alert("エラーが発生しました");
        console.log(err);
      }
      
    }

    fetchPosts();
    fetchUsers();
  }, [window.location.href]);


  const changeToPeople = () => {
    if(mode === "posts") {
      setMode("people");
    }
  }

  const changeToPosts = () => {
    if(mode === "people") {
      setMode("posts");
    }
  }

  return(
    <div className="ResultContainer">
      <div className="OptionsForResult">
        <div className="OptionForResult OptionLeftForResult" onClick={() => changeToPosts()}>
          {mode === "posts"
            ? <span className="text-lg border-b-4 border-indigo-500">Posts</span>
            : <span className="text-lg">Posts</span>
          }
        </div>
        <div className="OptionForResult" onClick={() => changeToPeople()}>
          {mode === "people"
            ? <span className="text-lg border-b-4 border-indigo-500">People</span>
            : <span className="text-lg">People</span>
          }
        </div>
      </div>
      <div className="ResultArea">
        {mode === "posts"
          ? 
          <div>
            {fetchedPosts.map((post) => {
              return(
                <Post post={post} userId={authState.user?._id ?? null}/>
              )
            })}
          </div>
          : <div>
            {fetchedUsers.map((user) => {
              return(
                <User user={user}/>
              )
            })}
          </div>
        }
        
      </div>
    </div>
  )
}