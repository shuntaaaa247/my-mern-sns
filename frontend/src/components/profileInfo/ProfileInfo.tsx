import React, { useContext, useEffect, useState } from "react"
import "./ProfileInfo.css"
import axios from "axios";
import mongoose, { Schema } from "mongoose";
import Modal from 'react-modal'
import EngineeringIcon from '@mui/icons-material/Engineering';
import ClearIcon from '@mui/icons-material/Clear';
import { AuthContext } from "../../state/AuthContext";
import { UserList } from "../userList/UserList";
import { Link, useNavigate } from "react-router-dom";
import { CircularProgress } from '@mui/material';

interface ProfileInfoProsps {
  userId: string;
}

export interface IReceivedUser {
  _id: Schema.Types.ObjectId,
  username: string,
  email: string,
  introduction: string,
  profilePicture: string,
  isAdmin: boolean,
  followers: mongoose.Types.ObjectId[], //フォロワーのuserのidが入る
  followings: mongoose.Types.ObjectId[], //フォロー中のuserのidが入る
}

const dummyUser: IReceivedUser = {
  _id: new Schema.Types.ObjectId("dummy_user_id"), //これを参照するにはdummyUser._id.path
  username: "dummy",
  email: "dummy@dummy.com",
  introduction: "this is dummy user",
  profilePicture: "",
  isAdmin: true,
  followers: [],
  followings: [],
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: "none",
    boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  },
}

Modal.setAppElement("body");

export default function ProfileInfo({userId}: ProfileInfoProsps) {
  const PUBLIC_FOLDER = process.env.REACT_APP_BACKEND_PUBLIC_FOLDER;
  const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;
  const { state: authState, dispatch, } = useContext(AuthContext);
  const [user, setUser] = useState<IReceivedUser>(dummyUser);
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //editのモーダルでusername,introductionを入力できるようにするため(valueをこれに設定しないと再レンダリングの関係でinput,textareaタグに入力できなくなる)
  const [usernameForEdit, setUsernameForEdit] = useState<string | undefined>(user.username); 
  const [introductionForEdit, setIntroductionForEdit] = useState<string | undefined>(user.introduction);
  const [fileForEdit, setFileForEdit] = useState<File | null>(null);

  //以下三つモーダルの設定
  function openModal() {
    setIsOpen(true)
  }
  
  function afterOpenModal() {
  }
  
  function closeModal() {
    setIsOpen(false);
    setUsernameForEdit(user.username);
    setIntroductionForEdit(user.introduction);
    setFileForEdit(null);
  }

  //userの編集
  const handleEditSave = async () => {
    let newIconFileName: string = "";

    setIsLoading(true);

    if(fileForEdit) {
      const data: FormData = new FormData();
      newIconFileName = Date.now().toString() +"_" + fileForEdit.name;
      data.append("name", newIconFileName);
      data.append("file", fileForEdit);

      try {
        //開発環境
        //await axios.post("/upload", data);

        //本番環境
        await axios.post(`${backendBaseUrl}/upload`, data);
      } catch(err) {
        console.log(err);
      }
    }

    try {
      if(fileForEdit) {
        //開発環境
        // await axios.put(`/user/${authState.user?._id}`, { //user編集APIを叩く
        //   _id: authState.user?._id,
        //   username: usernameForEdit,
        //   introduction: introductionForEdit,
        //   profilePicture: newIconFileName
        // });

        //本番環境
        await axios.put(`${backendBaseUrl}/user/${authState.user?._id}`, { //user編集APIを叩く
          _id: authState.user?._id,
          username: usernameForEdit,
          introduction: introductionForEdit,
          profilePicture: newIconFileName
        });
      } else {
        //開発環境
        // await axios.put(`/user/${authState.user?._id}`, { //user編集APIを叩く
        //   _id: authState.user?._id,
        //   username: usernameForEdit,
        //   introduction: introductionForEdit,
        // });

        //本番環境
        await axios.put(`${backendBaseUrl}/user/${authState.user?._id}`, { //user編集APIを叩く
          _id: authState.user?._id,
          username: usernameForEdit,
          introduction: introductionForEdit,
        });
      }
    } catch(err) {
      console.log(err);
      alert("編集に失敗しました");
    }
    setIsLoading(false);
    window.location.reload(); //画面をリロード
  }

  //フォロー、フォロー解除
  const handleFollow = async () => {
    try {
      //開発環境
      // await axios.put(`/user/${user._id.toString()}/follow`, {requesterId: authState.user?._id.toString()});

      //本番環境
      await axios.put(`${backendBaseUrl}/user/${user._id.toString()}/follow`, {requesterId: authState.user?._id.toString()});
      window.location.reload();
    } catch(err) {
      console.log(err);
      alert("エラーが発生しました");
    }
  }

  const handleSignOut = () => {
    const conf: boolean = window.confirm("本当にサインアウトしますか?");
    if(conf) {
      //サインアウト処理
      window.localStorage.removeItem("user");
      window.location.reload();
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        //開発環境
        //const response = await axios.get(`/user/${userId}`);

        //本番環境
        const response = await axios.get(`${backendBaseUrl}/user/${userId}`);
        setUser(response.data);
        setUsernameForEdit(response.data.username);
        setIntroductionForEdit(response.data.introduction);
      } catch(err) {
        alert("エラーが発生しました");
        console.log(err);
      }
      

    }
    fetchUser();

  }, []);
  
  if(window.location.href.includes("/followers") || window.location.href.includes("/following")) {
    return (
      <UserList />
    )
  }

  if(authState.user) {
    return(
      <div className="ProfileInfo">
        <div className="flex justify-between mt-4">
  
          { user.profilePicture === "" 
            ? <img src={PUBLIC_FOLDER + "/" + "default_user_icon.png"} alt="デフォルトユーザーアイコン" className="ProfileIcon"/> 
            : <img src={PUBLIC_FOLDER + "/" + user.profilePicture} alt="ユーザーアイコン" className="ProfileIcon"/> 
          }
          { (userId === authState.user?._id.toString())
            ? <div className="mt-2 mr-3">
                <button onClick={openModal} className="px-4 py-1 border-[1px] border-black font-semibold text-lg text-slate-900 rounded-3xl hover:bg-stone-100">
                  edit profile
                </button>
              </div>
            : <div className="mt-2 mr-3">
                <button onClick={() => handleFollow()} className="px-4 py-1 border-[1px] border-black font-semibold text-lg text-slate-900 rounded-3xl hover:bg-stone-100">
                  { user.followers.includes(authState.user._id) ? "unfollow" : "follow"}
                </button>
              </div>
          }
  
        </div>
        <div className="ProfileInfoDetails ml-10 mb-2">
          <span className="text-3xl">{user.username}</span>
          { user.isAdmin ? <EngineeringIcon className="ml-3 mb-3"/> : ""}
          <br />
          <span>{user.introduction}</span>
          <br />
          <div className="mt-2 flex">
            <div className="following hover:underline">
              <Link to={`/profile/${user._id}/following`}>
                <span className="font-semibold">{user.followings.length}</span>
                <span className="pl-1 text-stone-600">Following</span>
              </Link>
            </div>
            <div className="ml-2 followers hover:underline">
              <Link to={`/profile/${user._id}/followers`}>
                <span className="font-semibold">{user.followers.length}</span>
                <span className="pl-1 text-stone-600">Followers</span>
              </Link>
            </div>
          </div>
        </div>
  
        <Modal //editProfileが呼ばれたらレンダリングされる
          contentLabel="Example Modal"
          isOpen={modalIsOpen}
          style={customStyles}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
        >
          <div className="flex justify-between mb-1">
            <span><ClearIcon onClick={closeModal} /></span>
            <span className="text-3xl">Edit Profile</span>
            { isLoading 
              ? <CircularProgress />
              : <button onClick={() => {if(usernameForEdit !== "") { handleEditSave() }}} className="text-lg bg-stone-800 text-white px-3 rounded-3xl mb-1 hover:bg-stone-500">Save</button>
            }
            
          </div>
          <form className="EditForm">
            <div className="userIconEditArea">
            <label htmlFor="file">
              { fileForEdit 
                ? <img src={window.URL.createObjectURL(fileForEdit)} alt="ユーザーアイコン" className="ProfileIconForEdit" />
                  
                : user.profilePicture === ""
                  ? <img src={PUBLIC_FOLDER + "/" + "default_user_icon.png"} alt="デフォルトユーザーアイコン" className="ProfileIconForEdit"/> 
                  : <img src={PUBLIC_FOLDER + "/" + user.profilePicture} alt="ユーザーアイコン" className="ProfileIconForEdit"/> 
              }
              <input 
                type="file" 
                id="file" 
                accept=".png, .jpeg, .jpg" 
                style={{display: "none"}} 
                onChange={(e) => {
                    e.target.files 
                      ? setFileForEdit(e.target.files[0]) 
                      : setFileForEdit(null)
                    alert("現在、画像ファイルを投稿しても、バックエンドのストレージには保存されず、アプリ内でも表示されません。");
                  }}
              />
              <span>new file for icon: </span>
              <span className="rounded-sm bg-stone-200 ">{fileForEdit?.name}</span>
            </label>
            </div>
            <div className="UsernameEditerArea border-[1px] border-neutral-300 rounded-md mb-2">
              <label htmlFor="username" className="ml-2">username</label>
              <br />
              <input 
                type="text" 
                id="username" 
                value={usernameForEdit} 
                onChange={(e:React.ChangeEvent<HTMLInputElement>) => {setUsernameForEdit(e.target.value)}} 
                className="usernameInput focus:ring-0 text-xl"
              />
            </div>
            <div className="IntroductionEditerArea border-[1px] border-neutral-300 rounded-md">
              <label htmlFor="" className="ml-2">introduction</label>
              <br />
              <textarea 
                id="introduction" 
                value={introductionForEdit} 
                onChange={(e) => {setIntroductionForEdit(e.target.value)}} 
                className="introductionInput focus:ring-0"
              >  
              </textarea>
            </div>
          </form>
          <hr className="mt-3 mx-auto"/>
          <div className="flex flex-col mt-2">
            <button onClick={() => handleSignOut()} className="bg-stone-200 mx-auto px-3 py-1 mt-2 mb-1 rounded-md font-medium hover:bg-stone-100">Sign out</button>
            <button className="px-3 py-1 hover:underline" onClick={() => {navigate("/login")}}>Log in with other Account</button>
          </div>
        </Modal>
      </div>
    )
  } else {
    return(
      <>エラーが発生しました</>
    )
  }
}
  