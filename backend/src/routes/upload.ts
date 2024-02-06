import express, { Router } from "express";
import multer from "multer";

//画像アップロード用API
export const uploadRouter = () => {
  const router: Router = Router();

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  })
  
  const upload = multer({ storage });
  //画像アップロード用API
  router.post("/", upload.single("file"), (req: express.Request, res: express.Response) => {
    try{
      return res.status(200).json("画像アップロード完了");
    } catch(err) {
      console.log(err);
      return res.status(500).json(err);
    }
  });


  return router;
}

