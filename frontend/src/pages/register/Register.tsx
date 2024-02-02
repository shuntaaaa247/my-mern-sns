import React, { useRef } from "react"
import { AuthContext } from "../../state/AuthContext";
import { useContext } from "react";
import axios from "axios";
import { loginCall } from "../../state/actionCalls";
import { Link } from "react-router-dom";

interface INewUserInfo {
  username: string,
  email: string,
  password: string
}

export default function Register () {
  const { state: authState, dispatch } = useContext(AuthContext);

  const username = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(
      username.current !== undefined
      && username.current !== null
      && email.current !== undefined
      &&  email.current !== null 
      && password.current !== undefined
      && password.current !== null
      ) {
        const newUserInfo: INewUserInfo = {
          username: username.current.value,
          email: email.current.value,
          password: password.current.value
        }

        await axios.post("/auth/register", newUserInfo) //register APIの呼び出し

        loginCall({
          email: newUserInfo.email,
          password: newUserInfo.password
        }, dispatch);
      }
  }


  return(
    <div className="register">
      <div className="registerWrapper">
        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
          <input type="text" placeholder="ユーザーネーム" required ref={ username }/>
          <input type="email" placeholder="Eメール" required ref={ email } />
          <input type="password" placeholder="パスワード" required ref={ password } />
          <button>サインアップ</button>
          {JSON.stringify(authState)}
        </form>
        <Link to="/login">
          <span className="">ログインページ</span>
        </Link>
        <br/>
        { authState.user 
          ? <Link to="/">
              <span className="">ホームへ</span>
            </Link> 
          : <></>
        }
      </div>
    </div>
  )
}