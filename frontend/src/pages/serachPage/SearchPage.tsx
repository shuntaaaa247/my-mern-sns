import React, { useContext } from "react";
import "../home/Home.css";
import "./SearchPage.css";
import { AuthContext } from "../../state/AuthContext";
import Sidebar from "../../components/sidebar/Sidebar";
import Rightbar from "../../components/rightbar/Rightbar";
import { Search } from "../../components/search/Search";

export default function SearchPage() {
  const { state: authState, dispatch, } = useContext(AuthContext);

  return (
    <div className="homeContainer">
      <div className="mainContainer">
        <Sidebar />
        <Search />
        <Rightbar />
      </div>
    </div>
  )
}