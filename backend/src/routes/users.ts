import { Router } from "express";

export const userRouter = () => {
  const router = Router();

  router.get("/", (req, res) => {
    res.status(200).send({message: "Hello User"});
  })

  return router;
}