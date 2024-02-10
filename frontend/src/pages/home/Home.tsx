import React, { useContext } from "react";
import "./Home.css";
import { AuthContext } from "../../state/AuthContext";
import Sidebar from "../../components/sidebar/Sidebar";
import Timeline from "../../components/timeline/Timeline";
import Rightbar from "../../components/rightbar/Rightbar";

export default function Home() {
  const { state: authState, dispatch, } = useContext(AuthContext);

  return (
    // <div style={{height: "93%"}}>
    <div className="homeContainer">
      <div className="mainContainer">
        <Sidebar />
        <Timeline />
        <Rightbar />
      </div>
    </div>
  )
}