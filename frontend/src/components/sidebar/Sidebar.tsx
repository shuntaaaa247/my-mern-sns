import { Link } from "react-router-dom"
import "./Sidebar.css"
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import { useState, useRef, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../state/AuthContext";
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import GifBoxOutlinedIcon from '@mui/icons-material/GifBoxOutlined';
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';
import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { CircularProgress } from '@mui/material';


export default function Sidebar() {
  const PUBLIC_FOLDER = process.env.REACT_APP_BACKEND_PUBLIC_FOLDER;
  const { state: authState, dispatch, } = useContext(AuthContext);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const newPostDescription = useRef<HTMLTextAreaElement>(null);
  const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const modalContent = {
    background: "white",
    padding: "10px",
    borderRadius: "10px",
    height: "60%",
    transform: "translateX(35vw) translateY(-40%)",
  };

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
        // });

        //本番環境
        await axios.post(`${backendBaseUrl}/post/`, {
          auther: authState.user?._id,
          description: newPostDescription.current?.value,
          img: newPostFileName,
        });

        window.location.reload(); //画面をリロード

      } catch(err) {
        alert("投稿に失敗しました");
        console.log(err);
      }
    }
    setIsLoading(false);
  }

  const SidebarDefault = () => {
    return (
      <div className="ml-[25%]">
        <Link to="/">
          <h1 className="text-2xl font-nomal font-sans mt-8 mb-5">MY_MERN_SNS</h1>
        </Link>
        <Link to="/">
          <div className="SidebarLink AbleLink rounded">
            <HomeOutlinedIcon fontSize="large"/>
            <span className="text-2xl font-sans">Home</span>
          </div>
        </Link>
        <Link to="/search">
          <div className="SidebarLink AbleLink">
            <SearchOutlinedIcon fontSize="large"/>
            <h2 className="text-2xl font-sans">Explore</h2>
          </div>
        </Link>
        <Link to="#">
          <div className="SidebarLink">
            <NotificationsNoneOutlinedIcon fontSize="large"/>
            <h2 className="text-2xl font-sans">Notifications</h2>
          </div>
        </Link>
        <Link to="#">
          <div className="SidebarLink DisableLink">
            <EmailOutlinedIcon fontSize="large"/>
            <h2 className="text-2xl font-sans">Messages</h2>
          </div>
        </Link>
        <Link to={`/profile/${authState.user?._id}`}>
          <div className="SidebarLink AbleLink">
            <PermIdentityOutlinedIcon fontSize="large"/>
            <h2 className="text-2xl font-sans">Profile</h2>
          </div>
        </Link>
        <button onClick={() => setModalIsOpen(true)} className="font-bold text-2xl bg-indigo-600 hover:bg-indigo-500 text-white rounded-[50px] px-24 py-3 mr-3 mt-10">Post</button>
      </div>
    )
  }

  return(
    <div className="Sidebar">
      
      <SidebarDefault />
        {modalIsOpen 
          ? <div style={modalContent} className="flex flex-1 flex-col shadow-2xl rounded-2xl">
              <form onSubmit={((e: React.FormEvent<HTMLFormElement>) => handleSubmit(e))} className="h-full">
                <ClearIcon onClick={() => setModalIsOpen(false)} className="mt-[1%] mb-[2%]"/>
                { file 
                  ? <textarea placeholder="What is happenning?!" className="PostShareTextarea w-full h-[75%] focus:ring-0" ref={newPostDescription}/>
                  : <textarea placeholder="What is happenning?!" className="PostShareTextarea w-full h-[80%] focus:ring-0" ref={newPostDescription}/>
                }
                
                { file 
                  ? <div className="FileDisplay">
                      <label className="ml-3 px-1" onClick={() => setFile(null)}>×</label>
                      <span className="text-sm px-2 rounded-md bg-stone-200">{ file ? file.name : "" }</span>
                      
                    </div>
                  : <></>
                }
                <div className="separator mb-[2%]">
                  <hr />
                </div>
                <div className="ShareOptionsWrapper flex justify-start">
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
                            alert("現在、画像ファイルを投稿しても、バックエンドのストレージには保存されず、アプリ内でも表示されません。")
                          }}
                      />
                    </label>
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
                  {authState.user?.profilePicture === "" 
                    ? <img src={PUBLIC_FOLDER + "/" + "default_user_icon.png"} alt="デフォルトアイコン" className="ProfileIconNextToInputOnModal ml-auto"/>
                    : <img src={PUBLIC_FOLDER + "/" + authState.user?.profilePicture} alt="アイコン" className="ProfileIconNextToInputOnModal ml-auto"/>
                  }
                  <div className="ml-auto">
                    { isLoading 
                      ? <CircularProgress />
                      : <button className="PostShareButton bg-indigo-600 hover:bg-indigo-500 text-white rounded-3xl px-6 py-2">Post</button>
                    }
                    
                  </div>
                </div>
              </form>
            </div>
          : <></>
        }
    </div>

    
  )
}