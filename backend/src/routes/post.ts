import express, { Router } from "express";
import { Post, IPost } from "../models/Post";
import mongoose, { Schema, mongo } from "mongoose";
import { IUser, User } from "../models/User";

export const postRouter = () => {
  const router: Router = Router();

  //新規投稿
  router.post("/", async (req: express.Request, res: express.Response) => {
    try {
      const newPost = await new Post({
        auther: req.body.auther,
        description: req.body.description,
        img: req.body.img,
      })

      const post: IPost = await newPost.save();

      return res.status(200).json(post);
    } catch(err) {
      console.log("Error at postRouter");
      return res.status(500).json(err);
    }
  })

  //一つの投稿を取得
  router.get("/:id", async (req: express.Request, res: express.Response) => {
    try {
      const post = await Post.findById(req.params.id);
      return res.status(200).json(post);
    } catch (err) {
      console.log("Error at postRouter\n", err);
      return res.status(403).json(err);
    }
  })

  //一つの投稿を削除
  router.delete("/:id", async (req: express.Request, res:express.Response) => {
    try {
      const post = await Post.findById(req.params.id);
      console.log(`post = ${post}`);
      if(post?.auther.toString() === req.body.requesterId) {
        await post?.deleteOne();
        return res.status(200).json("削除完了");
      } else {
        console.log(post?.auther.toString());
        console.log(req.body.requesterId);
        return res.status(403).json("あなたのポストではありません");
        
      }
    } catch(err) {
      console.log("Error at postRouter\n", err);
      return res.status(403).json(err);
    }
  })

  //一つの投稿を編集
  router.put("/:id", async (req: express.Request, res: express.Response) => {
    try {
      const post = await Post.findById(req.params.id);
      if(post?.auther.toString() === req.body.auther) {
        await post?.updateOne ({
          $set: req.body
        })
        return res.status(200).json("ポスト編集完了");
      } else {
        return res.status(403).json("他人の投稿です");
      }
    } catch (err) {
      return res.status(403).json(err);
    }
  })

  //投稿にいいねorいいね解除
  router.put("/:id/like", async (req: express.Request, res: express.Response) => {
    try {
      const post = await Post.findById(req.params.id);
      if(!post?.likes.includes(req.body.requesterId)) {
        await post?.updateOne({
          $push: {
            likes: req.body.requesterId
          }
        })
        return res.status(200).json("いいね完了");
      } else {
        await post?.updateOne({
          $pull: {
            likes: req.body.requesterId
          }
        })
        return res.status(200).json("いいね解除");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  })

  //タイムラインの取得
  router.get("/timeline/:id", async (req: express.Request, res: express.Response) => {
    try {
      const currentUser = await User.findById(req.params.id);
      const userPosts: IPost[] = await Post.find({ auther: currentUser?._id});

      console.log("currentUser = ");
      console.log(currentUser);

      const friendPosts = await Promise.all(
        currentUser!.followings.map((friendId) => {
          console.log("あああ")
          console.log(friendId)
          return Post.find({ auther: friendId }); //map内のコールバック関数でreturnを使うと、左辺の変数（定数）が配列になり、returnされた値が一つずつ入っていく。
        })
      )
      
      console.log("userPosts = ");
      console.log(userPosts);
      console.log("friendPosts = ");
      console.log(friendPosts);

      return res.status(200).json(userPosts.concat(...friendPosts));
      
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  })

  return router;
}