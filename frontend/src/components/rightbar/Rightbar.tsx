import { useState, useEffect } from "react"
import "./Rightbar.css"
import { IUser } from "../../state/AuthContext"
import axios from "axios";

export default function Rightbar() {
  const [recomendedUsers, setRecomendedUsers] = useState<IUser[]>([]);
  const PUBLIC_FOLDER = process.env.REACT_APP_BACKEND_PUBLIC_FOLDER;
  const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;

  useEffect(()=> {
    const fetchRandomUsers = async() => {
      setRecomendedUsers([]);
      const response = await axios.get("/user/random/3");
      setRecomendedUsers(response.data);
    }
    fetchRandomUsers();

  }, []);

  return(
    <div className="Rightbar">
      <div className="w-[90%] bg-stone-100 rounded-3xl ml-auto mr-auto mt-[5%]">
        <p className="text-3xl font-semibold pt-4 pl-5">Trends to track</p>
        <ul className="ml-[8%] pb-5">
          <li className="my-2">
            <span className="text-sm text-stone-600">1・Trend</span>
            <br />
            <span className="text-lg">TypeScript</span>
          </li>
          <li className="my-2">
            <span className="text-sm text-stone-600">2・Trend</span>
            <br />
            <span className="text-lg">Python</span>
          </li>
          <li className="my-2">
            <span className="text-sm text-stone-600">3・Trend</span>
            <br />
            <span className="text-lg">Full Stack</span>
          </li>
          <li className="my-2">
            <span className="text-sm text-stone-600">4・Trend</span>
            <br />
            <span className="text-lg">Node.js</span>
          </li>
          <li className="my-2">
            <span className="text-sm text-stone-600">5・Trend</span>
            <br />
            <span className="text-lg">T3 Stack</span>
          </li>
        </ul>
      </div>

      {/* Who to follow */}
      <div className="w-[90%] bg-stone-100 rounded-3xl ml-auto mr-auto mt-[5%]">
        <p className="text-3xl font-semibold pt-4 pl-5">Who to follow</p>
        <ul className="ml-[5%] pb-5">
          {/* <Link to={`profile/${recomendedUsers[0]?._id}`}> */}
          <a href={`${FRONTEND_URL}/profile/${recomendedUsers[0]?._id}`}>
            <li className="flex mt-2 mb-2">
              { recomendedUsers[0]?.profilePicture === "" 
                ? <img src={PUBLIC_FOLDER + "/" + "default_user_icon.png"} alt="デフォルトユーザーアイコン" className="ProfileIconOnRightbar"/> 
                : <img src={PUBLIC_FOLDER + "/" + recomendedUsers[0]?.profilePicture} alt="ユーザーアイコン" className="ProfileIconOnRightbar"/> 
              }
              <span className="mt-auto mb-auto">{ recomendedUsers[0]?.username.toString() }</span>
            </li>
          </a>
          {/* </Link> */}
          <a href={`${FRONTEND_URL}/profile/${recomendedUsers[1]?._id}`}>
            <li className="flex mt-2 mb-2">
              { recomendedUsers[1]?.profilePicture === "" 
                ? <img src={PUBLIC_FOLDER + "/" + "default_user_icon.png"} alt="デフォルトユーザーアイコン" className="ProfileIconOnRightbar"/> 
                : <img src={PUBLIC_FOLDER + "/" + recomendedUsers[1]?.profilePicture} alt="ユーザーアイコン" className="ProfileIconOnRightbar"/> 
              }
              <span className="mt-auto mb-auto">{ recomendedUsers[1]?.username.toString() }</span>
            </li>
          </a>
          <a href={`${FRONTEND_URL}/profile/${recomendedUsers[2]?._id}`}>
            <li className="flex mt-2 mb-2">
              { recomendedUsers[2]?.profilePicture === "" 
                ? <img src={PUBLIC_FOLDER + "/" + "default_user_icon.png"} alt="デフォルトユーザーアイコン" className="ProfileIconOnRightbar"/> 
                : <img src={PUBLIC_FOLDER + "/" + recomendedUsers[2]?.profilePicture} alt="ユーザーアイコン" className="ProfileIconOnRightbar"/> 
              }
              <span className="mt-auto mb-auto">{ recomendedUsers[2]?.username.toString() }</span>
            </li>
          </a>
        </ul>
      </div>
    </div>
  )
}