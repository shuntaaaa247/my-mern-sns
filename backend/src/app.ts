import express from 'express';
const app = express();
const PORT = 3000; // ローカルサーバーのポート番号
import { userRouter } from './routes/users';
import { authRouter } from './routes/auth';
import 'dotenv/config';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//mongoDBと接続
const mongoUrl: string = process.env.MONGOURL as string;
mongoose
    .connect(mongoUrl)
    .then(() => {
        console.log("データベースと接続中");
    }).catch((err) => {
        console.log(err);
    })

app.use("/api/users", userRouter());
app.use("/api/auth", authRouter());

app.get("/", (req, res) => { //ルート(http://localhost:3000)にアクセスしたときの挙動を設定
    res.send("Hello Express"); //レスポンスとして、文字列を画面に出力させる
})

export default app;

//app.listen(PORT, () => console.log("サーバーが起動しました")) //Webサーバーを起動