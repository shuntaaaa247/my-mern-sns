
import { useEffect, useState } from "react";
import { IReceivedPost } from "../timeline/Timeline"
import { IUser } from "../../state/AuthContext";
import axios from "axios";

interface PostProps {
  post: IReceivedPost;
}


export default function Post({post}: PostProps) {
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
      <p className="font-sans text-lg">{autherInfo?.username}</p>
      <p>{post.description.toString()}</p>
    </div>
  )
}