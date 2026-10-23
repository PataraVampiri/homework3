const express = require("express");
const router = express.Router();

const {
  getAnimals,
  getAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal,
} = require("./animals.controller");

router.get("/", getAnimals);
router.get("/:id", getAnimalById);
router.post("/", createAnimal);
router.put("/:id", updateAnimal);
router.delete("/:id", deleteAnimal);

module.exports = router;