const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const UserModel = require("../models/UserModel");
const UserController = require("../controllers/userControllers");
const UserMiddleware = require("../middleware/userMiddleware");

const router = express.Router();

dotenv.config();

router.use(express.json());
router.use(express.urlencoded({extended: false}));
router.use(cookieParser());

mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.gd7v733.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`)
  .then(() => console.log(`Connected to MongoDB`))
  .catch(err => console.error(err));

router.route("/signup")
  .get((req, res) => res.render("signup"))
  .post(UserController.signup);

router.route("/login")
  .get((req, res) => res.render("login"))
  .post(UserController.login);

router.route("/logout")
  .get(UserController.logout);

router.route("/")
  .get(UserMiddleware.requireAuth, async (req, res) => {
    try {
      const products = await UserModel.find({});
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  })
  .post(UserMiddleware.requireAuth, async (req, res) => {
    try {
      const product = await UserModel.create(req.body);
      res.status(201).json(product);
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  });

router.route("/:id")
  .get(UserMiddleware.requireAuth, async (req, res) => {
    try {
      const {id} = req.params;
      const product = await UserModel.findById(id);
      if (!product) return res.status(404).json({message: `Cannot find any product with ID ${id}`});
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  })
  .put(UserMiddleware.requireAuth, async (req, res) => {
    try {
      const {id} = req.params;
      const product = await UserModel.findByIdAndUpdate(id, req.body);
      if (!product) return res.status(404).json({message: `Cannot find any product with ID ${id}`});
      const updatedProduct = await UserModel.findById(id);
      res.status(200).json(updatedProduct);
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  })
  .delete(UserMiddleware.requireAuth, async (req, res) => {
    try {
      const {id} = req.params;
      const product = await UserModel.findByIdAndDelete(id);
      if (!product) return res.status(404).json({message: `Cannot find any product with ID ${id}`});
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  });

module.exports = router;
