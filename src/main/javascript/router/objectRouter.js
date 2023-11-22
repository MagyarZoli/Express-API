const express = require("express");

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended: false}));

let array = [];
let index = 0;

router.route("/")
  .get(async (req, res, next) => {
    try {
      res.status(200).json(array);
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  })
  .post( async (req, res, next) => {
  try {
    const {firstName, lastName, age, study} = req.body;
    const obj = {id: ++index, firstName: firstName, lastName: lastName, age: age, study: study}
    array.push(obj);
    res.status(201).json(obj);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

router.route("/:id")
  .get(async (req, res, next) => {
    try {
      const {id} = req.params;
      let j = -1;
      for (let i in array) {
        if (array[i].id == id) {
          j = i;
          break;
        }
      }
      if (j === -1) return res.status(404).json({message: `Cannot find any object with ID ${id}`});
      res.status(200).json(array[j]);
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  })
  .put(async (req, res, next) => {
    try {
      const {id} = req.params;
      const {firstName, lastName, age, study} = req.body;
      let j = -1;
      for (let i in array) {
        if (array[i].id == id) {
          j = i;
          const updateObject = {firstName, lastName, age, study};
          for (const key in updateObject) {
            if (updateObject[key] !== undefined && updateObject[key] !== null) {
              array[j][key] = updateObject[key];
            }
          }
          break;
        }
      }
      if (j === -1) return res.status(404).json({message: `Cannot find any object with ID ${id}`});
      res.status(200).json(array[j]);
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  })
  .delete(async (req, res, next) => {
    try {
      const {id} = req.params;
      let remove = undefined;
      let j = -1;
      for (let i in array) {
        if (array[i].id == id) {
          j = i;
          remove = array[j];
          array.splice(j, 1);
          break;
        }
      }
      if (j === -1) return res.status(404).json({message: `Cannot find any object with ID ${id}`});
      res.status(200).json(remove);
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  });

module.exports = router;
