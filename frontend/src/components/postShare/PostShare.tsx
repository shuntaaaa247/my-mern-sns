import "./PostShare.css"
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import GifBoxOutlinedIcon from '@mui/icons-material/GifBoxOutlined';
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';
import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { useRef, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../state/AuthContext";


export default function PostShare() {
  const { state: authState, dispatch, } = useContext(AuthContext);

  const newPostDescription = useRef<HTMLTextAreaElement>(null);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();

    if(newPostDescription.current?.value !== "" || null || undefined) {
      try {
        await axios.post("/post/", {
          auther: authState.user?._id,
          description: newPostDescription.current?.value,
          img: "",
        }) //imgはまだ未実装

        window.location.reload() //画面をリロード

      } catch(err) {
        alert("投稿に失敗しました");
        console.log(err);
      }
    }  

  }
  return(
    <form className="PostShareForm" onSubmit={((e: React.FormEvent<HTMLFormElement>) => handleSubmit(e))}>
      <div className="PostShareTextareaWapper">
        <textarea placeholder="What is happenning?!" className="PostShareTextarea" ref={newPostDescription}/>
      </div>
      <div className="separator">
        <hr />
      </div>
      <div className="ShareOptionsWrapper">
        <div className="ShareOption">
          <ImageOutlinedIcon className="imageIcon"/>
        </div>
        <div className="ShareOption">
          <GifBoxOutlinedIcon className="imageIcon"/>
        </div>
        <div className="ShareOption">
          <FormatListNumberedOutlinedIcon />
        </div>
        <div className="ShareOption">
          <SentimentSatisfiedAltOutlinedIcon />
        </div>
        <div className="ShareOption">
          <LocationOnOutlinedIcon />
        </div>

        <div className="PostShareButtonArea">
          <button className="PostShareButton bg-indigo-600 hover:bg-indigo-500 text-white rounded-3xl px-6 py-2 mr-3 translate-y-0.5">Post</button>
        </div>
      </div>
    </form>
  )
}