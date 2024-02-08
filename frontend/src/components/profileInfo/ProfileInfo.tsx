import React, { useContext, useEffect, useState } from "react"
import "./ProfileInfo.css"
import axios from "axios";
import mongoose, { Schema } from "mongoose";
import Modal from 'react-modal'
import EngineeringIcon from '@mui/icons-material/Engineering';
import ClearIcon from '@mui/icons-material/Clear';
import { AuthContext } from "../../state/AuthContext";


interface ProfileInfoProsps {
  userId: string;
}

interface IReceivedUser {
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
  const { state: authState, dispatch, } = useContext(AuthContext);
  const [user, setUser] = useState<IReceivedUser>(dummyUser);
  let subtitle: HTMLHeadingElement | null
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);

  //editのモーダルでusername,introductionを入力できるようにするため(valueをこれに設定しないと再レンダリングの関係でinput,textareaタグに入力できなくなる)
  const [usernameForEdit, setUsernameForEdit] = useState<string | undefined>(user.username); 
  const [introductionForEdit, setIntroductionForEdit] = useState<string | undefined>(user.introduction);

  //以下三つモーダルの設定
  function openModal() {
    setIsOpen(true)
  }
  
  function afterOpenModal() {
    if (subtitle) subtitle.style.color = '#f00'
  }
  
  function closeModal() {
    setIsOpen(false);
    setUsernameForEdit(user.username);
    setIntroductionForEdit(user.introduction);
  }

  //userの編集
  const handleEditSave = async () => {
    try {
      await axios.put(`/user/${authState.user?._id}`, { //user編集APIを叩く
        _id: authState.user?._id,
        username: usernameForEdit,
        introduction: introductionForEdit
      });
    } catch(err) {
      console.log(err);
      alert("編集に失敗しました");
    }
    window.location.reload(); //画面をリロード
  }

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get(`/user/${userId}`);
      setUser(response.data);
      setUsernameForEdit(response.data.username);
      setIntroductionForEdit(response.data.introduction);
    }
    fetchUser();
  }, []);

  return(
    <div className="ProfileInfo">
      <div className="flex justify-between mt-4">
        <img src={PUBLIC_FOLDER + "/" + "default_user_icon.png"} alt="デフォルトアイコン" className="ProfileIcon"/>
        { (userId === authState.user?._id.toString())
          ? <div className="mt-2 mr-3">
              <button onClick={openModal} className="px-4 py-1 border-[1px] border-black font-semibold text-lg text-slate-900 rounded-3xl hover:bg-stone-100">
                edit profile
              </button>
            </div>
          : <></>
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
            <span className="font-semibold">{user.followings.length}</span>
            <span className="pl-1 text-stone-600">Following</span>
          </div>
          <div className="ml-2 followers hover:underline">
            <span className="font-semibold">{user.followers.length}</span>
            <span className="pl-1 text-stone-600">Followers</span>
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
          <button onClick={() => handleEditSave()} className="text-lg bg-stone-800 text-white px-3 rounded-3xl mb-1 hover:bg-stone-500">Save</button>
        </div>
        <form className="EditForm">
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
      </Modal>
    </div>
  )
}