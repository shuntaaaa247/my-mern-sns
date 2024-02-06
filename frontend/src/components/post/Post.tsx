import { useEffect, useState } from "react";
import { IReceivedPost } from "../timeline/Timeline"
import { IUser } from "../../state/AuthContext";
import axios from "axios";
import "./Post.css";


interface PostProps {
  post: IReceivedPost;
}

export default function Post({post}: PostProps) {
  const PUBLIC_FOLDER = process.env.REACT_APP_BACKEND_PUBLIC_FOLDER;
  const [autherInfo, setAutherInfo] = useState<IUser>();

  useEffect(() => {
    const getAuther = async () => {
      const response = await axios.get(`/user/${post.auther.toString()}`);
      console.log(response);
      setAutherInfo(response.data);
    }
    getAuther();
  }, []);
  
  return(
    <div className="Post">
      <span className="px-[2%] font-sans text-lg">{autherInfo?.username}</span>
      <span className="font-sans text-sm">{post.createdAt.toString()}</span>
      <p className="px-[2%] pt-[1%] pb-[2%]">{post.description.toString()}</p>
      {post.img === "" 
        ? <></> 
        : <img src={PUBLIC_FOLDER + "/" + post.img.toString()} alt="投稿画像" className="PostImg"/>
      }
    </div>
  )
}