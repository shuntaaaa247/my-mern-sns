import express, { Router } from "express";
import { IUser, User } from "../models/User";
import mongoose, {Schema} from "mongoose";

export const userRouter = () => {
  const router = Router();

  interface IReceivedUser {
    _id: Schema.Types.ObjectId,
    username: string,
    email: string,
    introduction: string,
    profilePicture: string,
    isAdmin: boolean,
    followers: mongoose.Types.ObjectId[], //フォロワーのuserのidが入る
    followings: mongoose.Types.ObjectId[], //フォロー中のuserのidが入る
  }

  //idでユーザーを取得
  router.get("/:id", async (req: express.Request, res: express.Response) => {
    try {
      const user: IReceivedUser | null = await User.findById(req.params.id)!;
      const receivedUser = {
        _id: user?._id,
        username: user?.username,
        email: user?.email,
        introduction: user?.introduction,
        profilePicture: user?.profilePicture,
        isAddmin: user?.isAdmin,
        followers: user?.followers,
        followings: user?.followings
      }
      return res.status(200).send(receivedUser);
    } catch (err) {
      return res.status(500).json(err)
    }
  })

  //ユーザー情報を更新
  router.put("/:id", async (req: express.Request, res: express.Response) => {

    if(req.body._id === req.params.id) {
      try {
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body
        });
        return res.status(200).json("ユーザー情報更新完了");
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json("他人のアカウントは編集できません");
    }
  })

  //ユーザーの削除
  router.delete("/:id", async (req: express.Request, res: express.Response) => {
    if(req.params.id === req.body.requesterId) {
      try {
        const user = await User.findByIdAndDelete(req.params.id);
        return res.status(200).json("削除完了");
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json("他人のアカウントは削除できません");
    }
  })

  //フォロー機能
  router.put("/:id/follow", async(req: express.Request, res: express.Response) => {
    if(req.params.id !== req.body.requesterId) {
      try {
        const targetUser = await User.findById(req.params.id); //フォローしたい相手のユーザーを取得
        const currentUser = await User.findById(req.body.requesterId); //フォローを申し込んだユーザー(ログイン中のユーザー)を取得

        //フォローしたいUserのフォロワーに自分が含まれていない場合、フォローができる。
        if(!targetUser?.followers.includes(req.body.requesterId) && targetUser !== null) {
          await targetUser.updateOne({
            $push: {
              followers: req.body.requesterId
            }
          })

          await currentUser?.updateOne({
            $push: {
              followings: req.params.id
            }
          })

          return res.status(200).json("フォロー完了");
        } else if(targetUser?.followers.includes(req.body.requesterId) && targetUser !== null) { 
          //すでにフォローしていた場合はフォロー解除処理
          await targetUser.updateOne({
            $pull: {
              followers: req.body.requesterId
            }
          })

          await currentUser?.updateOne({
            $pull: {
              followings: req.params.id
            }
          })
          
          return res.status(200).json("フォロー解除");
        }
      } catch (err) {
        return res.status(500).json(err);
      }
    }
  })
  

  return router;
}