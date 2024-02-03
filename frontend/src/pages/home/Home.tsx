import React, { useContext } from "react";
import "./Home.css";
import Topbar from "../../components/topbar/Topbar";
import { AuthContext } from "../../state/AuthContext";

export default function Home() {
  const { state: authState, dispatch, } = useContext(AuthContext);
  return (
    <div>
      <div className="homeContainer">
        <Topbar />
      </div>
      {JSON.stringify(authState)}
    </div>
  )
}