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
        isAdmin: user?.isAdmin,
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
  
  //ランダムにユーザーを抽出する
  router.get("/random/:length", async(req: express.Request, res: express.Response) => {
    try {
      let users: IReceivedUser[];
      users = await User.aggregate([{$sample: {size: +req.params.length}}]); //lenght分だけランダムにUserを取得する。
      return res.status(200).json(users);
    } catch(err) {
      console.log(err);
      return res.status(500).json(err);
    }
  })

  //ユーザーの検索
  router.get("/search/user_search", async(req: express.Request, res: express.Response) => {
    try {
      const searchText: string = req.query.text as string;
      if(!searchText) {
        return res.status(400).json({ message: "検索文字列が指定されていません" });
      }

      //正規表現：[]の中に入れた文字(カンマなどで区切らない)のどれか一つに当てはまったら(今回は半角スペースと全角スペース)、そしてそれが一回以上繰り返されたらsplitで分割する
      const searchKeywords: string[] = searchText.split(/[ 　]+/); 

      //クエリの配列ができる。(or演算子を使って二つのフィールドにおけるクエリを記述)
      const searchConditions = searchKeywords.map(keyword => ({ 
        $or: [{username: { $regex: keyword, $options: "i" }}, {introduction: { $regex: keyword, $options: "i" }}]
      }))

      const fetchedPosts = await User.find({ $and: searchConditions});

      return res.status(200).json(fetchedPosts);
    } catch(err) {
      console.log(err);
      return res.status(500).json(err);
    }
  })

  return router;
}