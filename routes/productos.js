const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const Producto = require("../models/Producto");
const User = require("../models/User");

router.get("/productos", async (req, res) => {
  try {
    // console.log(req.headers);

    const { authorization } = req.headers;

    // console.log(authorization.split(" "));

    const token = authorization.split(" ").pop();

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // console.log(payload);

    const { uid } = payload;

    const productos = await Producto.find();

    const user = User.findById(uid);

    // console.log(productos);
    res.json(productos, user);
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: err.message });
  }
});

router.get("/productos/:id", async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    // console.log(producto);
    res.json(producto);
  } catch (err) {
    console.log(err);
  }
});

router.post("/productos", async (req, res) => {
  //   console.log(req.body);
  try {
    const producto = new Producto({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      stock: req.body.stock,
    });
    const result = await producto.save();
    // console.log(result);
    res.json(result);
  } catch (err) {
    console.log(err);
  }
});

router.put("/productos/:id", async (req, res) => {
  //   console.log(req.body);
  try {
    const result = await Producto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    // console.log(result);
    res.json(result);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/productos/:id", async (req, res) => {
  try {
    const result = await Producto.findByIdAndDelete(req.params.id);
    // console.log(result);
    // res.json(result);
    const msg = result ? "Registro borrado" : "No se encontró el registro";
    res.json({ msg });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
