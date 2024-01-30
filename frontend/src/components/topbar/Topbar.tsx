import React from "react";
import "./Topbar.css"
import { Search } from '@mui/icons-material'

export default function Topbar() {

  return(
    <div className="topbarContainer">
      <div className="topbarLeft">
        <p className="logoText">MY MERN SNS</p>
      </div>

      <div className="topbarCenter">
        <p className="timelineText">タイムライン</p>
      </div>

      <div className="topbarRight">
        <label className="searchBar" htmlFor="searchInput">
        <Search className="searchIcon"></Search> 
        <input type="text" id="searchInput" className="searchInput" placeholder="Search" />
        </label>
      </div>
    </div>
  )
}