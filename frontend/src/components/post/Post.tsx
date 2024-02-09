import { useEffect, useState } from "react";
import { IReceivedPost } from "../timeline/Timeline"
import { IUser } from "../../state/AuthContext";
import axios from "axios";
import "./Post.css";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ScatterPlotOutlinedIcon from '@mui/icons-material/ScatterPlotOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TurnedInNotOutlinedIcon from '@mui/icons-material/TurnedInNotOutlined';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import { pink } from "@mui/material/colors";
import mongoose from "mongoose";
import { Link } from "react-router-dom";

interface PostProps {
  post: IReceivedPost;
  userId: mongoose.Types.ObjectId | null;
}

export default function Post({post, userId}: PostProps) {
  const PUBLIC_FOLDER = process.env.REACT_APP_BACKEND_PUBLIC_FOLDER;
  const [autherInfo, setAutherInfo] = useState<IUser>();
  const [likeNum, setLikeNum] = useState<number>(post.likes.length);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
    const getAuther = async () => {
      const response = await axios.get(`/user/${post.auther.toString()}`);
      setAutherInfo(response.data);
    }
    getAuther();

    if (userId) {
      setIsLiked(post.likes.includes(userId));
    };
    
  }, []);

  const handleLike = async () => {
    isLiked 
      ? setLikeNum(likeNum - 1)
      : setLikeNum(likeNum + 1)
    ;
    setIsLiked(!isLiked);

    if (userId) {
      // alert((await axios.put(`/post/${userId.toString()}/like`, {requesterId: userId.toString()})).data); //いいねAPIを叩く
      await axios.put(`/post/${post._id.toString()}/like`, {requesterId: userId.toString()});
    };
  }
  
  return(
    <div className="Post">
      <div className="flex mt-2 ml-2">
        <Link to={`/profile/${autherInfo?._id}`}>
          {autherInfo?.profilePicture === "" 
            ? <img src={PUBLIC_FOLDER + "/" + "default_user_icon.png"} alt="デフォルトアイコン" className="UserIcon"/>
            : <img src={PUBLIC_FOLDER + "/" + autherInfo?.profilePicture} alt="アイコン" className="UserIcon"/>
          }
        </Link>
        <div className="mt-auto mb-auto">
          <Link to={`/profile/${autherInfo?._id}`}>
            <span className="px-[2%] mr-1 font-sans text-lg">{autherInfo?.username}</span>
          </Link>
        </div>
        <div className="mt-auto mb-auto ml-2">
          <span className="font-sans text-sm">{post.createdAt.toString()}</span>
        </div>
      </div>
      <p className="px-[2%] pt-[1%] pb-[2%]">{post.description.toString()}</p>
      {post.img === "" 
        ? <></> 
        : <img src={PUBLIC_FOLDER + "/" + post.img.toString()} alt="投稿画像" className="PostImg"/>
      }
      <div className="ActionButtons">
        <div>
          <ChatBubbleOutlineIcon sx={{ fontSize: 26 }} className="p-1"/>
        </div>
        <div>
          { isLiked 
            ? <FavoriteIcon sx={{ fontSize: 26, color: pink[500]}} className="p-1 hover:bg-stone-200 rounded-md" onClick={async () => await handleLike()}/>
            : <FavoriteBorderIcon sx={{ fontSize: 26 }} className="p-1 hover:bg-stone-200 rounded-md" onClick={async () => await handleLike()}/>
          }
          <span className="text-sm ml-1">{likeNum === 0 ? "" : likeNum}</span>
        </div>
        <div>
          <ScatterPlotOutlinedIcon sx={{ fontSize: 26 }} className="p-1"/>
        </div>
        <div>
          <InsertChartOutlinedIcon sx={{ fontSize: 26 }} className="p-1"/>
        </div>
        <div>
        <TurnedInNotOutlinedIcon sx={{ fontSize: 26 }} className="p-1"/>
        </div>
        <div>
          <IosShareOutlinedIcon sx={{ fontSize: 26 }} className="p-1"/>
        </div>
      </div>
    </div>
  )
}