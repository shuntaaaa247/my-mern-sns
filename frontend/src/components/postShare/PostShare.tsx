import "./PostShare.css"
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import GifBoxOutlinedIcon from '@mui/icons-material/GifBoxOutlined';
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';
import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

export default function PostShare() {
  return(
    <form className="PostShareForm">
      <div className="PostShareTextareaWapper">
        <textarea placeholder="What is happning?!" className="PostShareTextarea"/>
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
          <button className="PostShareButton bg-blue-400 hover:bg-blue-300 text-white rounded-3xl px-6 py-2 mr-3 translate-y-0.5">Post</button>
        </div>
      </div>
    </form>
  )
}