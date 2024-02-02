import React, { useContext, useRef } from "react";
import { AuthContext } from "../../state/AuthContext";
import { loginCall } from "../../state/actionCalls";
import { Link } from "react-router-dom";

export default function Login() {
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const { state: authState, dispatch, } = useContext(AuthContext);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if(
      email.current !== undefined
      &&  email.current !== null 
      && password.current !== undefined
      && password.current !== null
      ) {
        loginCall({
        email: email.current.value,
        password: password.current.value
      }, dispatch);

      console.log(authState);
    }
  }
  return (
    <div className="login">
      <div className="loginWrapper">
        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
        <input type="email" placeholder="Eメール" required ref={email}/>
        <input type="password" placeholder="パスワード" required ref={password}/>
        <button>ログイン</button>
        {JSON.stringify(authState)}
        </form>
        <Link to="/register">
          <span className="sidebarListItemText">サインアップページ</span>
        </Link>
        <br/>
        { authState.user 
          ? <Link to="/">
              <span className="">ホームへ</span>
            </Link> 
          : <></>
        }
      </div>
      
    </ div>



  )
}