const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const Producto = require("../models/Producto");
const User = require("../models/User");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/img/productos");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.get("/productos", async (req, res) => {
  try {
    // console.log(req.headers);

    // const { authorization } = req.headers;

    // console.log(authorization.split(" "));

    // const token = authorization.split(" ").pop();

    // const payload = jwt.verify(token, process.env.JWT_SECRET);

    // console.log(payload);

    // const { uid } = payload;

    const productos = await Producto.find().limit;

    // const user = User.findById(uid);

    // console.log(productos);
    res.json(productos);
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

router.post("/productos", upload.single("imagen"), async (req, res) => {
  console.log(req.body, req.file);

  try {
    const producto = new Producto({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      imagen: req.file.filename,
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

router.put("/productos/:id", upload.single("imagen"), async (req, res) => {
  //   console.log(req.body);
  try {
    const result = await Producto.findByIdAndUpdate(
      req.params.id,
      {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        imagen: req.file.filename,
        precio: req.body.precio,
        stock: req.body.stock,
      },
      {
        new: true,
      }
    );
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

router.get("/productos/search/:filter", async (req, res) => {
  const { filter } = req.params;

  try {
    const productos = await Producto.find({ nombre: { $regex: filter } });

    res.json(productos);
  } catch (error) {
    console.log(err);
  }
});

module.exports = router;
