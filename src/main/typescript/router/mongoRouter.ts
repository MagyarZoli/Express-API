import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import User from "../models/UserModel";
import { signup, login, logout } from "../controllers/userControllers";
import { requireAuth } from "../middleware/userMiddleware";
import authRouter from "./authRouter";

const router = express.Router();

dotenv.config();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(cookieParser());

router.use("/auth", authRouter);

mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME!}:${process.env.MONGODB_PASSWORD!}@cluster0.gd7v733.mongodb.net/${process.env.MONGODB_DATABASE!}?retryWrites=true&w=majority`)
  .then(() => console.log(`Connected to MongoDB`))
  .catch(err => console.error(err));

router.route("/signup")
  .get((req: Request, res: Response) => res.render("signup"))
  .post(signup);

router.route("/login")
  .get((req: Request, res: Response) => res.render("login"))
  .post(login);

router.route("/logout")
  .get(logout);

router.route("/user")
  .get(requireAuth, async (req: Request, res: Response) => {
    try {
      const products = await User.find({});
      res.status(200).json(products);
    } catch (err: any) {
      res.status(500).json({ message: err.message});
    }
  })
  .post(requireAuth, async (req: Request, res: Response) => {
    try {
      const product = await User.create(req.body);
      res.status(201).json(product);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

router.route("/user/:id")
  .get(requireAuth, async (req: Request, res: Response) => {
    try {
      const {id} = req.params;
      const product = await User.findById(id);
      if (!product) return res.status(404).json({ message: `Cannot find any product with ID ${id}` });
      res.status(200).json(product);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  })
  .put(requireAuth, async (req: Request, res: Response) => {
    try {
      const {id} = req.params;
      const product = await User.findByIdAndUpdate(id, req.body);
      if (!product) return res.status(404).json({ message: `Cannot find any product with ID ${id}` });
      const updatedProduct = await User.findById(id);
      res.status(200).json(updatedProduct);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  })
  .delete(requireAuth, async (req: Request, res: Response) => {
    try {
      const {id} = req.params;
      const product = await User.findByIdAndDelete(id);
      if (!product) return res.status(404).json({ message: `Cannot find any product with ID ${id}` });
      res.status(200).json(product);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

export default router;
