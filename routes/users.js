const express = require("express");
const router = express.Router();

router.get("/users", (req, res) => {
  res.send("Listado de usuarios");
});

router.get("/users/:id", (req, res) => {
  //   console.log(req.params.id);
  res.send("Usuario: " + req.params.id);
});

router.post("/users", (req, res) => {
  //   console.log(req.body.email);
  res.send("Creación de usuario " + req.body.email);
});

router.put("/users", (req, res) => {
  //   console.log(req.body.email);
  res.send(
    `Modificación de usuario ${req.body.id} nuevo email ${req.body.email}`
  );
});

router.put("/users/:id/edit", (req, res) => {
  res.send(
    `Modificación de usuario ${req.params.id} nuevo email ${req.body.email}`
  );
});

router.delete("/users/:id", (req, res) => {
  res.send("Borrado de usuario " + req.params.id);
});

module.exports = router;
