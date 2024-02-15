import { useNavigate } from "react-router-dom";
import { IReceivedUser } from "../profileInfo/ProfileInfo";
import mongoose from "mongoose";
import "./User.css";

interface UserProps {
  user: IReceivedUser;
}

//ユーザー一覧の一つ一つを作るコンポーネント
export const User = ({user}: UserProps) => {
  const navigate = useNavigate();
  const PUBLIC_FOLDER = process.env.REACT_APP_BACKEND_PUBLIC_FOLDER;

  const toProfile = (id: mongoose.Schema.Types.ObjectId) => {
    navigate(`/profile/${id}`);
  }

  return (
    <li key={user._id.toString()} onClick={() => toProfile(user._id)} className="px-3 hover:bg-stone-100 list-none">
      <div className="flex justify-start pt-3 pb-3">
        {user?.profilePicture === "" 
          ? <img src={PUBLIC_FOLDER + "/" + "default_user_icon.png"} alt="デフォルトアイコン" className="UserIconOnUserList"/>
          : <img src={PUBLIC_FOLDER + "/" + user?.profilePicture} alt="アイコン" className="UserIconOnUserList"/>
        }
        <div className="flex flex-col">
          <span className="ml-1 text-lg">{user.username}</span>
          <span className="ml-1 text-sm text-stone-600">{user.introduction}</span>
        </div>
      </div>
    </li>
  )
}