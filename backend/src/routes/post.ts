import express, { Router } from "express";
import { Post, IPost } from "../models/Post";
import mongoose, { Schema, mongo } from "mongoose";
import { IUser, User } from "../models/User";
import { text } from "body-parser";

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

      const friendPosts = await Promise.all(
        currentUser!.followings.map((friendId) => {
          return Post.find({ auther: friendId }); //map内のコールバック関数でreturnを使うと、左辺の変数（定数）が配列になり、returnされた値が一つずつ入っていく。
        })
      )

      return res.status(200).json(userPosts.concat(...friendPosts));
      
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  })

  //プロフィール画面用のタイムラインの取得
  router.get("/profile/timeline/:id", async (req: express.Request, res: express.Response) => {
    try {
      const currentUser = await User.findById(req.params.id);
      const userPosts: IPost[] = await Post.find({ auther: currentUser?._id});

      return res.status(200).json(userPosts);
    } catch(err) {
      console.log(err);
      return res.status(500).json(err);
    }
  })

  //投稿の検索
  router.get("/search/post_search", async (req: express.Request, res: express.Response) => {
    try {
      //req.query.textで~/search/post_search?text=xxxのxxxを取得できる
      const searchText: string = req.query.text as string;
      if(!searchText) {
        return res.status(400).json({ message: "検索文字列が指定されていません" });
      }

      //正規表現：[]の中に入れた文字(カンマなどで区切らない)のどれか一つに当てはまったら(今回は半角スペースと全角スペース)、そしてそれが一回以上繰り返されたらsplitで分割する
      const searchKeywords: string[] = searchText.split(/[ 　]+/); 

      //「description(Postのフィールド): クエリ」の形式を返され、それが配列となる
      const searchConditions = searchKeywords.map(keyword => ({ 
        description: { $regex: keyword, $options: "i" } //$regexは指定のフィールド(description)に指定の文字列(keyword)を含むドキュメントを探す演算子
      }))

      //$orで配列内のクエリをそれぞれ実行し、そのクエリ全てに当てはまるドキュメントを探す。findなので結果のドキュメント達が配列fetchedPostsに格納される
      const fetchedPosts = await Post.find({ $and: searchConditions});

      return res.status(200).json(fetchedPosts);
      
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  })
  

  return router;
}