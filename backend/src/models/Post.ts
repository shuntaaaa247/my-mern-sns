import mongoose, { Schema, model } from "mongoose"

export interface IPost {
  auther: mongoose.Types.ObjectId,
  description: string,
  img: string,
  likes: mongoose.Types.ObjectId[] //likeを押したユーザーのidが格納される
}

const PostSchema = new Schema<IPost>(
  {
    auther: {type: Schema.Types.ObjectId, ref: "User", required: true},
    description: {type: String, max: 200, required: true},
    img: {type: String, required: false, default: ""},
    likes: [{ type: Schema.Types.ObjectId, ref: "User"}]
  },
  {timestamps: true}
)

export const Post = model("Post", PostSchema);