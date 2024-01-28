import mongoose, { Schema, model, connect, ObjectId } from "mongoose"

export interface IUser {
  username: string,
  email: string,
  password: string,
  profilePicture?: string, //画像のパス
  followers: mongoose.Types.ObjectId[], //フォロワーのidの配列
  followings: mongoose.Types.ObjectId[], //フォロー中のユーザーのidの配列
}

const UserSchema = new Schema<IUser>({
  username: {type: String, min: 3, max: 30, required: true, unique: true},
  email: {type: String, max: 50, required: true, unique: true},
  password: {type: String, required: true},
  profilePicture: {type: String, default: ""},
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }], 
  followings: [{ type: Schema.Types.ObjectId, ref: 'User' }] 
})

export const User =  model("User", UserSchema);