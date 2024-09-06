const { validateAccount } = require("../models/account/validate");
const { getAll, create, update, getById, remove} = require("../models/cars");

const getAllCars = async (req, res) => {
    try {
        const data = await getAll(req.auth.id);
        return res.status(200).send(data);
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error!");
    }
};

const createCar = async (req, res) => {
    try {
        const data = {
            ...req.body,
            owner: req.auth.id,
          };
        const newCar = await create(data);
        return res.status(200).send(newCar);
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error!");
    }
}

const updateCar = async (req, res) => {
    try {
        const carId = req.params.id;
        const data = req.body;

        const carExists = await getById(carId);

        if(!carExists) {
            return res.status(400).send("Car is not found!");
        }

        if(carExists.owner.toString() !== req.auth.id) {
            return res.status(400).send("This is not your car!")
        }

        await update(carId, data);
        return res.status(200).send("Car updated successfully!");
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error!");
    }
}

const removeCar = async (req, res) => {
    try {
        const carId = req.params.id;
        const carExists = await getById(carId);

        if(!carExists) {
            return res.status(400).send("Car is not found!");
        }

        if(carExists.owner.toString() !== req.auth.id) {
            return res.status(400).send("This is not your car!")
        }

        await remove(carId);
        return res.status(200).send("Car removed successfully!")

    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error!");
    }
}

module.exports = {
    getAllCars,
    createCar,
    updateCar,
    removeCar
}