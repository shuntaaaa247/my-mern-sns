import React, { createContext, useReducer, useEffect } from "react";
import AuthReducer from "./AuthReducer";
import mongoose from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId,
  username: string,
  email: string,
  password: string, //ハッシュ化済みのパスワード
  introduction: string,
  profilePicture?: string,
  isAdmin: boolean,
  followers: mongoose.Types.ObjectId[],
  followings: mongoose.Types.ObjectId[],
}

export interface IAuthState {
  user: IUser | null,
  isFetching: boolean,
  error: boolean
}

//ユーザー状態の初期値
const initialState: IAuthState = {
  user: JSON.parse(localStorage.getItem("user") || "{}"), //userという名前の値をlocalStorage上で探し持ってくる
  isFetching: false,
  error: false,
}

type Props = {
  children: React.ReactNode
}

//状態をグローバルに管理する
export const AuthContext = createContext({} as {
  state: IAuthState,
  dispatch: React.Dispatch<any>
})

export const AuthContextProvider= ({ children }: Props) => {
  const [authState, dispatch] = useReducer(AuthReducer, initialState);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(authState.user))
  }, [authState.user]);

  return(
    <AuthContext.Provider value = {{ state: authState, dispatch }}>
      { children }
    </AuthContext.Provider>
  )
}



