import React, { useEffect, useState } from "react"
import { IReceivedUser } from "../profileInfo/ProfileInfo"
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';
import "./UserList.css";
import mongoose from "mongoose";
import { User } from "../user/User";


export const UserList = () => {
  const [targetUser, setTargetUser] = useState<IReceivedUser>();
  const [fetchedUsers, setFetchedUsers] = useState<IReceivedUser[]>([]);
  const urlParams = useParams<{userId: string}>(); 
  const navigate = useNavigate();
  const PUBLIC_FOLDER = process.env.REACT_APP_BACKEND_PUBLIC_FOLDER;
  const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;

  useEffect(() => {
    const fetchTargetUser = async () => {
      try {
        const response = await await axios.get(`/user/${urlParams.userId}`);
        setTargetUser(response.data);
      } catch (err) {
        console.log(err);
        alert(err);
      }
    }
    fetchTargetUser();
  }, []);

  useEffect(() => {
    if(targetUser) {
      fetchUsers();
    }
  }, [targetUser])

  const fetchUsers = async () => {
    let tempList = [];
    try {
      if(targetUser?.followers?.length && window.location.href.includes("followers")) {
        for(let i: number = 0; i < targetUser?.followers?.length; i ++) {
          //本番環境用
          //const response = await axios.get(`/user/${targetUser.followers[i]}`);

          //本番環境用デバッグ
          const response = await axios.get(`${backendBaseUrl}/user/${targetUser.followers[i]}`);
          tempList.push(response.data);
        }
        setFetchedUsers(tempList);
      } else if(targetUser?.followers?.length && window.location.href.includes("following")) {
        for(let i: number = 0; i < targetUser?.followings?.length; i ++) {
          //本番環境用
          //const response = await axios.get(`/user/${targetUser.followings[i]}`);

          //本番環境用デバッグ
          const response = await axios.get(`${backendBaseUrl}/user/${targetUser.followings[i]}`);

          tempList.push(response.data);
        }
        setFetchedUsers(tempList);
      } else {
        throw new Error("if文を通過できませんでした");
      }
    } catch (err) {
      console.log(err);
      alert(err);
    }
  }

  const toFollowers = () => {
    if(window.location.href.includes("following")) {
      navigate(`/profile/${targetUser?._id}/followers`);
      window.location.reload();
    }
  }

  const toFollowing = () => {
    if(window.location.href.includes("followers")) {
      navigate(`/profile/${targetUser?._id}/following`);
      window.location.reload();
    }
  }

  const toProfile = (id: mongoose.Schema.Types.ObjectId) => {
    navigate(`/profile/${id}`);
  }


  return(
    <div>
      <div className="TopBar">
          <span className="text-3xl">{targetUser?.username}</span>
      </div>
      <div className="Options">
          <div className="Option OptionLeft" onClick={() => toFollowing()}>
            {window.location.href.includes("following") 
              ? <span className="text-lg border-b-4 border-indigo-500">following</span>
              : <span className="text-lg">following</span>
            }
          </div>
          <div className="Option" onClick={() => toFollowers()}>
            {window.location.href.includes("followers") 
              ? <span className="text-lg border-b-4 border-indigo-500">followers</span>
              : <span className="text-lg">followers</span>
            }
          </div>
      </div>
      <ul>
        {fetchedUsers.map((user) => 
          <User user={user}/>
        )}
      </ul>
    </div>
  )
}