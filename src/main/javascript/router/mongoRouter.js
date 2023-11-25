const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");

const userModel = require("../models/UserModel");
const userController = require("../controllers/userControllers");
const userMiddleware = require("../middleware/userMiddleware");
const authRouter = require("./authRouter");

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended: false}));
router.use(cookieParser());

router.use("/auth", authRouter);

mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.gd7v733.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`)
  .then(() => console.log(`Connected to MongoDB`))
  .catch(err => console.error(err));

router.route("/signup")
  .get((req, res) => res.render("signup"))
  .post(userController.signup);

router.route("/login")
  .get((req, res) => res.render("login"))
  .post(userController.login);

router.route("/logout")
  .get(userController.logout);

router.route("/user")
  .get(userMiddleware.requireAuth, async (req, res) => {
    try {
      const products = await userModel.find({});
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  })
  .post(userMiddleware.requireAuth, async (req, res) => {
    try {
      const product = await userModel.create(req.body);
      res.status(201).json(product);
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  });

router.route("/user/:id")
  .get(userMiddleware.requireAuth, async (req, res) => {
    try {
      const {id} = req.params;
      const product = await userModel.findById(id);
      if (!product) return res.status(404).json({message: `Cannot find any product with ID ${id}`});
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  })
  .put(userMiddleware.requireAuth, async (req, res) => {
    try {
      const {id} = req.params;
      const product = await userModel.findByIdAndUpdate(id, req.body);
      if (!product) return res.status(404).json({message: `Cannot find any product with ID ${id}`});
      const updatedProduct = await userModel.findById(id);
      res.status(200).json(updatedProduct);
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  })
  .delete(userMiddleware.requireAuth, async (req, res) => {
    try {
      const {id} = req.params;
      const product = await userModel.findByIdAndDelete(id);
      if (!product) return res.status(404).json({message: `Cannot find any product with ID ${id}`});
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  });

module.exports = router;
