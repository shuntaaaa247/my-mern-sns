import express from 'express';
const app = express();
import { userRouter } from './routes/user';
import { authRouter } from './routes/auth';
import { postRouter } from './routes/post';
import 'dotenv/config';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from "cors";
import { uploadRouter } from './routes/upload';
import path from 'path';

//corsの設定
const allowedOrigins:string[] = ["http://localhost:3001", "https://my-mern-sns.vercel.app"];
const options = {
    origin: allowedOrigins,
};
app.use(cors(options));

//mongoDBと接続
const mongoUrl: string = process.env.MONGOURL as string;
mongoose
    .connect(mongoUrl)
    .then(() => {
        console.log("データベースと接続中");
    }).catch((err) => {
        console.log(err);
    })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/images", express.static(path.join(path.resolve(__dirname, ".."), "public/images"))) //frontendのenvファイルから静的ファイルを求めて呼び出される。__dirname + public/imagesでbackendの画像フォルダへのパスを表す。
app.use("/api/user", userRouter());
app.use("/api/auth", authRouter());
app.use("/api/post", postRouter());
app.use("/api/upload", uploadRouter());

app.get("/", (req, res) => { //ルート(http://localhost:3000)にアクセスしたときの挙動を設定
    res.send("Hello Express"); //レスポンスとして、文字列を画面に出力させる
})

app.get("/__dirname", (req, res) => {
    res.send(path.join(path.resolve(__dirname, ".."), "public/images"));
})

export default app;

//app.listen(PORT, () => console.log("サーバーが起動しました")) //Webサーバーを起動