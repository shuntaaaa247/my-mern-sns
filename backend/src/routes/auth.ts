import express, { Router } from "express";
import { User, IUser } from "../models/User";
import sha256 from 'crypto-js/sha256';

export const authRouter = () => {
  const router: Router = Router();

  router.post("/register", async(req: express.Request, res: express.Response) => {
    try {
      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: sha256(req.body.password),
      })

      const user: IUser = await newUser.save();

      return res.status(200).json(user);
    } catch(err) {
      const usersWhoHaveSameEmail = await User.find({email: req.body.email});
      if (usersWhoHaveSameEmail.length > 0) {
        return res.status(500).json("Error: the email is already in use" + "\n" + err);
      }
      console.log("Error at authRouter");
      return res.status(500).json(err);
    }
  })

  router.post("/login", async(req: express.Request, res: express.Response) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if(!user) {
        return res.status(404).send("ユーザーが見つかりませんでした");
      }

      const passwordValidator: boolean = sha256(req.body.password).toString() === user.password;

      if(!passwordValidator) {
        return res.status(400).send("パスワードが違います");
      }

      return res.status(200).json(user);
    } catch(err) {
      console.log("Error at authRouter");
      return res.status(500).json(err);
    }
  })
  return router;
}