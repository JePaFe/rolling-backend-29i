const express = require("express");
const router = express.Router();

const Producto = require("../models/Producto");

router.get("/productos", async (req, res) => {
  try {
    const productos = await Producto.find();
    // console.log(productos);
    res.json(productos);
  } catch (err) {
    console.log(err);
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
