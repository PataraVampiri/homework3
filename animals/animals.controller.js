const animals = require("./animals.data");
const { paginate } = require("../utils");


function getAnimals(req, res) {
  let filteredAnimals = animals.filter(
    (animal) => !animal.deleted
  );

  const { color, species, page, limit } = req.query;

  if (color) {
    filteredAnimals = filteredAnimals.filter(
      (animal) =>
        animal.color.toLowerCase() === color.toLowerCase()
    );
  }

  if (species) {
    filteredAnimals = filteredAnimals.filter(
      (animal) =>
        animal.species.toLowerCase() === species.toLowerCase()
    );
  }

  const result = paginate(filteredAnimals, page, limit);

  res.status(200).json(result);
}


function getAnimalById(req, res) {
  const animal = animals.find(
    (item) => item.id === Number(req.params.id) && !item.deleted
  );

  if (!animal) {
    return res.status(404).json({ message: "Animal not found" });
  }

  res.status(200).json(animal);
}


function createAnimal(req, res) {
  const { name, species, color } = req.body;

  if (!name || !species || !color) {
    return res.status(400).json({
      message: "name, species and color are required",
    });
  }

  const newAnimal = {
    id: animals.length
      ? Math.max(...animals.map((animal) => animal.id)) + 1
      : 1,
    name,
    species,
    color,
  };

  animals.push(newAnimal);

  res.status(201).json(newAnimal);
}


function updateAnimal(req, res) {
  const animal = animals.find(
    (item) => item.id === Number(req.params.id) && !item.deleted
  );

  if (!animal) {
    return res.status(404).json({ message: "Animal not found" });
  }

  const { name, species, color } = req.body;

  if (name !== undefined) animal.name = name;
  if (species !== undefined) animal.species = species;
  if (color !== undefined) animal.color = color;

  res.status(200).json(animal);
}


function deleteAnimal(req, res) {
  const deleteMode = req.get("x-delete-mode");

  if (!["soft", "permanent"].includes(deleteMode)) {
    return res.status(400).json({
      message:
        "Header x-delete-mode must be 'soft' or 'permanent'",
    });
  }

  const index = animals.findIndex(
    (item) => item.id === Number(req.params.id) && !item.deleted
  );

  if (index === -1) {
    return res.status(404).json({ message: "Animal not found" });
  }

  if (deleteMode === "soft") {
    animals[index].deleted = true;

    return res.status(200).json({
      message: "Animal soft-deleted successfully",
    });
  }

  const deletedAnimal = animals.splice(index, 1)[0];

  res.status(200).json({
    message: "Animal permanently deleted",
    data: deletedAnimal,
  });
}

module.exports = {
  getAnimals,
  getAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal,
};