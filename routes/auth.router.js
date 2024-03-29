const express = require("express");
const {
  login,
  register,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");
const { body } = require("express-validator");
const { reset } = require("nodemon");
const router = express.Router();

router.post("/login", login);

router.post(
  "/register",
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("El correo es requerido")
      .isEmail()
      .withMessage("El correo es incorrecto"),
    body("password")
      .notEmpty()
      .withMessage("El password es requerido")
      .isLength(5)
      .withMessage("El password tiene que tener 5 caracteres o mas")
      .custom((value, { req }) => value === req.body.password_confirmation)
      .withMessage("La contraseñas no coinciden"),
  ],
  register
);

router.post("/forgot", forgotPassword);

router.post("/reset/:id/:token", resetPassword);

module.exports = router;
