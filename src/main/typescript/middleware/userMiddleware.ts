import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import dotenv from "dotenv";

import User from "../models/UserModel";

dotenv.config();

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!,
      { algorithms: ['HS256'] },
      (err: VerifyErrors | null, decodedToken?: object | string) => {
        if (err) {
          res.redirect(`/login`);
        } else {
          next();
        }
      }
    );
  } else {
    res.redirect(`/login`);
  }
};

export const checkUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt;
    if (token) {
      const decodedToken = jwt.verify(token, `${process.env.JWT_SECRET_KEY!}`) as JwtPayload;
      res.locals.user = await User.findById(decodedToken.id);
    } else {
      res.locals.user = null;
    }
  } catch (err) {
    res.locals.user = null;
  }
  next();
};
