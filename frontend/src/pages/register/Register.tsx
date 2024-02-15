import React, { useRef, useState } from "react"
import { AuthContext } from "../../state/AuthContext";
import { useContext } from "react";
import axios, { AxiosError } from "axios";
import { loginCall } from "../../state/actionCalls";
import { Link, useNavigate } from "react-router-dom";

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
  const [isEmailError, setIsEmailError] = useState<boolean>(false);

  const navigate = useNavigate();

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

        try {
          await axios.post("/auth/register", newUserInfo) //register APIの呼び出し

          loginCall({
            email: newUserInfo.email,
            password: newUserInfo.password
          }, dispatch);

          if(authState.user) {
            navigate("/");
          }
        } catch(err: any) {
          if(err.response.data.includes("Error: the email is already in use")) {
            setIsEmailError(true);
          } else {
            alert("エラーが発生しました");
          }
        }
      }
  }


  return(
    <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8 mx-[33%] translate-y-24 shadow-2xl rounded-2xl">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">
            Register your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST" onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
          <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  ref={username}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  ref={email}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  ref={password}
                />
              </div>
            </div>
            
            {isEmailError 
              ? <p className="text-red-600 text-sm font-medium text-center">そのメールアドレスはすでに使用されています</p> 
              : <></>
            }
            
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 mt-[10%] mb-[3%] text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Register
              </button>
            </div>
          </form>
          <Link to="/login"><p className="text-center mt-8 text-sm font-medium hover:underline">すでにアカウントをお持ちですか？</p></Link>
          {authState.user 
            ? <Link to="/"><p className="text-center mt-2 mb-0 text-sm font-medium hover:underline">ホームへ戻りますか？</p></Link>
            : <></>
          }
          
        </div>
        {/* {JSON.stringify(authState)} */}
      </div>
  )
}