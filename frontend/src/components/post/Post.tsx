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
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { pink } from "@mui/material/colors";
import mongoose from "mongoose";
import { Link } from "react-router-dom";
import Modal from 'react-modal' //モーダル用(デフォルト)
import { format } from "timeago.js";

interface PostProps {
  post: IReceivedPost;
  userId: mongoose.Types.ObjectId | null;
}

export default function Post({post, userId}: PostProps) {
  const PUBLIC_FOLDER = process.env.REACT_APP_BACKEND_PUBLIC_FOLDER;
  const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;
  const [autherInfo, setAutherInfo] = useState<IUser>();
  const [likeNum, setLikeNum] = useState<number>(post.likes.length);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string>("");
  const [thisPostIsDeleted, setThisPostIsDeleted] = useState<boolean>(false);

  const customStyles = {//モーダル用(オリジナルで修正部分あり)
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      border: "none", //モーダルのボーダーをなくすためにオリジナルで追加
      boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)", //モーダルの影をリッチにするためにオリジナルで追加
    },
  }

  Modal.setAppElement("body"); //モーダル用(デフォルト)

  const [modalIsOpen, setIsOpen] = useState<boolean>(false)

  function openModal() {
    setIsOpen(true)
  }

  function afterOpenModal() {
    // if (subtitle) subtitle.style.color = '#f00'
  }

  function closeModal() {
    setIsOpen(false)
  }

  useEffect(() => {
    const getAuther = async () => {
      try {
        //本番用
        //const response = await axios.get(`/user/${post.auther.toString()}`);

        //本番環境デバッグ用
        const response = await axios.get(`${backendBaseUrl}/user/${post.auther.toString()}`);
        setAutherInfo(response.data);
      } catch (err) {
        alert("エラーが発生しました");
        console.log(err);
      }
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
      //いいねAPIを叩く
      try {
        //本番環境用
        //await axios.put(`/post/${post._id.toString()}/like`, {requesterId: userId.toString()});

        //本番環境デバッグ用
        await axios.put(`${backendBaseUrl}/post/${post._id.toString()}/like`, {requesterId: userId.toString()});
      } catch(err) {
        alert("エラーが発生しました");
        console.log(err);
      }
      
    };
  }

  const handleDeleteOnTimeline = () => {
    openModal();
  }

  const handleDeleteOnModal = async () => {
    try {
      if(userId) {
        try {
          //本番用
          // await axios.delete(`/post/${post._id}`, {
          //   data: {requesterId: userId?.toString()}
          // }) 

          //本番環境デバッグ
          await axios.delete(`${backendBaseUrl}/post/${post._id}`, {
            data: {requesterId: userId?.toString()}
          }) 
        } catch (err) {
          alert("エラーが発生しました");
          console.log(err);
        }
      } else {
        throw new Error("userId is not found");
      }

      setThisPostIsDeleted(true);
      closeModal();
    } catch (err) {
      console.log(err);
      setDeleteErrorMessage("エラーが発生しました")
    }
  }

  if(thisPostIsDeleted) {
    return (<></>);
  } else {
    return(
      <div className="Post">
        <div className="flex mt-2 ml-2 mr-0">
          <Link to={`/profile/${autherInfo?._id}`}>
            {autherInfo?.profilePicture === "" 
              ? <img src={PUBLIC_FOLDER + "/" + "default_user_icon.png"} alt="デフォルトアイコン" className="UserIcon"/>
              : <img src={PUBLIC_FOLDER + "/" + autherInfo?.profilePicture} alt="アイコン" className="UserIcon"/>
            }
          </Link>
          <div className="mt-auto mb-auto w-[80%]">
            <Link to={`/profile/${autherInfo?._id}`}>
              <span className="px-[2%] mr-1 font-sans text-lg">{autherInfo?.username}</span>
              <span className="font-sans text-sm">{format(post.createdAt.toString())}</span>
            </Link>
          </div>
          {autherInfo?._id === userId 
            ? <DeleteOutlineIcon onClick={() => handleDeleteOnTimeline()} className="PostDeleteIcon"/>
            : <></>
          }
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
  
        <Modal
          contentLabel="Example Modal"
          isOpen={modalIsOpen}
          style={customStyles}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
        >
          <button onClick={closeModal} className="text-xl"> × </button>
          <div className="flex">
            {autherInfo?.profilePicture === "" 
              ? <img src={PUBLIC_FOLDER + "/" + "default_user_icon.png"} alt="デフォルトアイコン" className="UserIcon"/>
              : <img src={PUBLIC_FOLDER + "/" + autherInfo?.profilePicture} alt="アイコン" className="UserIcon"/>
            }
            <div className="mt-auto mb-auto">
              <span className="px-[2%] mr-1 font-sans text-lg">{autherInfo?.username}</span>
            </div>
            <div className="mt-auto mb-auto ml-2">
              <span className="font-sans text-sm">{post.createdAt.toString()}</span>
            </div>
          </div>
          <p className="px-[2%] pt-[1%] pb-[2%]">{post.description.toString()}</p>
          {post.img === "" 
            ? <></> 
            : <img src={PUBLIC_FOLDER + "/" + post.img.toString()} alt="投稿画像" className="PostImgForDelete"/>
          }
          <div className="flex justify-center">
            <button onClick={() => handleDeleteOnModal()} className=" mt-3 px-5 py-1 rounded-md bg-rose-500 text-white font-semibold hover:bg-rose-400">削除</button>
          </div>
          <span>{deleteErrorMessage}</span>
        </Modal>
      </div>
    )
  }
}