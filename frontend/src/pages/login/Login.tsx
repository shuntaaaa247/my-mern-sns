import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "../../state/AuthContext";
import { loginCall } from "../../state/actionCalls";
import { Link, useNavigate } from "react-router-dom";
import { CircularProgress } from '@mui/material';

export default function Login() {
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { state: authState, dispatch, } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();

    setIsLoading(true);

    if(
      email.current !== undefined
      &&  email.current !== null 
      && password.current !== undefined
      && password.current !== null
      ) {
      await loginCall({
        email: email.current.value,
        password: password.current.value
      }, dispatch);

      console.log("テストテスト");
      console.log(authState);

      if(authState.user) {
        navigate("/")
      }
    }

    setIsLoading(false);
  }
  return (
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8 mx-[33%] translate-y-32 shadow-2xl rounded-2xl">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          {/* <p>{authState.user?.username ? "ユーザーあり" : "ユーザーなし"}</p> */}
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST" onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
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
            <p className="text-red-600 text-sm font-medium text-center">
              {authState.error 
                ? "メールアドレス または パスワードが間違っています"
                : ""
              }
            </p>
            <div>
              { isLoading 
                ? <div  className="flex w-full justify-center">
                    <CircularProgress />
                  </div>
                  
                : <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 mt-[10%] mb-[3%] text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign in
                  </button>
                }
            </div>
          </form>
          <Link to="/register"><p className="text-center mt-8 text-sm font-medium hover:underline">アカウントをお持ちではありませんか？</p></Link>
          {authState.user 
            ? <Link to="/"><p className="text-center mt-2 mb-0 text-sm font-medium hover:underline">ホームへ戻りますか？</p></Link>
            : <></>
          }
          <p onClick={() => 
            alert("アカウントの作成をスキップしたい方は、採用担当者(ゲスト)アカウントをお使いください。\n email: recruiter@recruiter.com \n password: recruiter")
          } className="text-center mt-8 text-sm font-medium cursor-pointer hover:underline">採用担当者の方へ</p>
        </div>
      </div>
  )
}