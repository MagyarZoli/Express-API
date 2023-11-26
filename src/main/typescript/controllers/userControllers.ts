import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { MongoError } from "mongodb";

import User from "../models/UserModel";

dotenv.config();

const DAY = 24 * 60 * 60;

export const signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    return res.status(201).json({ user });
  } catch (err) {
    const errors = handleErrors(err as MongoError);
    res.status(400).json({ errors });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user?._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * 3 * DAY });
    res.status(200).json({ user });
  } catch (err) {
    const errors = handleErrors(err as MongoError);
    res.status(400).json({ errors });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

export const createToken = (id: string | number) => {
  return jwt.sign({ id }, `${process.env.JWT_SECRET_KEY!}`, { expiresIn: 3 * DAY });
};

const handleErrors = (err: MongoError) => {
  let errors: { username: string, email: string, password: string, login: string } = {
    username: "",
    email: "",
    password: "",
    login: ""
  };
  if (err.message === "Incorrect email") errors.login = "That email is not registered";
  if (err.message === "Incorrect password") errors.login = "That email or password is incorrect";
  if (err.code === 11000) errors.email = "That email is already registered";
  return errors;
};
