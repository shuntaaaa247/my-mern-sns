import "./PostShare.css"
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import GifBoxOutlinedIcon from '@mui/icons-material/GifBoxOutlined';
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';
import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { useRef, useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../state/AuthContext";
import { CircularProgress } from '@mui/material';


export default function PostShare() {
  const PUBLIC_FOLDER = process.env.REACT_APP_BACKEND_PUBLIC_FOLDER;
  const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;

  const { state: authState, dispatch, } = useContext(AuthContext);

  const newPostDescription = useRef<HTMLTextAreaElement>(null);

  const [file, setFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();

    setIsLoading(true);

    if(newPostDescription.current?.value !== "" || null || undefined) {
      let newPostFileName: string = "";
    
      if(file) {
        const data: FormData = new FormData();
        newPostFileName = Date.now().toString() +"_" + file.name;
        data.append("name", newPostFileName);
        data.append("file", file);

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
        //開発環境
        // await axios.post("/post/", {
        //   auther: authState.user?._id,
        //   description: newPostDescription.current?.value,
        //   img: newPostFileName,
        // })

        //本番環境
        await axios.post(`${backendBaseUrl}/post/`, {
          auther: authState.user?._id,
          description: newPostDescription.current?.value,
          img: newPostFileName,
        })

        window.location.reload() //画面をリロード

      } catch(err) {
        alert("投稿に失敗しました");
        console.log(err);
      }
    }  

    setIsLoading(false);

  }
  return(
    <form className="PostShareForm" onSubmit={((e: React.FormEvent<HTMLFormElement>) => handleSubmit(e))}>
      <div className="PostShareTextareaWapper flex">
        {authState.user?.profilePicture === "" 
          ? <img src={PUBLIC_FOLDER + "/" + "default_user_icon.png"} alt="デフォルトアイコン" className="ProfileIconNextToInput"/>
          : <img src={PUBLIC_FOLDER + "/" + authState.user?.profilePicture} alt="アイコン" className="ProfileIconNextToInput"/>
        }
        <textarea placeholder="What is happenning?!" className="PostShareTextarea focus:ring-0" ref={newPostDescription}/>
      </div>
      { file 
        ? <div className="FileDisplay">
            <label className="ml-3 px-1" onClick={() => setFile(null)}>×</label>
            <span className="text-sm px-2 rounded-md bg-stone-200">{ file ? file.name : "" }</span>
            <span className="text-rose-600"> ! 現在、画像ファイルを投稿しても、バックエンドのストレージには保存されず、アプリ内でも表示されません。</span>
          </div>
        : <></>
      }
      <div className="separator">
        <hr />
      </div>
      <div className="ShareOptionsWrapper">
        <div className="ShareOption hover:bg-stone-200 rounded-sm">
          <label htmlFor="file">
            <ImageOutlinedIcon className="imageIcon"/>
            <input 
              type="file" 
              id="file" 
              accept=".png, .jpeg, .jpg" 
              style={{display: "none"}} 
              onChange={(e) => {
                e.target.files 
                  ? setFile(e.target.files[0]) 
                  : setFile(null)
                }}
            />
          </label>
        </div>
        <div className="ShareOption">
          <GifBoxOutlinedIcon/>
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

        { isLoading
          ? <CircularProgress />
          : <div className="PostShareButtonArea">
              <button className="PostShareButton bg-indigo-600 hover:bg-indigo-500 text-white rounded-3xl px-6 py-2 mr-3 translate-y-0.5">Post</button>
            </div>
        }
      </div>
    </form>
  )
}