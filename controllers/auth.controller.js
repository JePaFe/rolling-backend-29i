const { validationResult } = require("express-validator");
const User = require("../models/User");

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });

    if (user == null) {
      return res
        .status(403)
        .json({ error: "El correo y/o la contraseña son incorrectos" });
    }

    const passwordCorrecto = await user.comparePassword(password);

    if (passwordCorrecto == false) {
      return res
        .status(403)
        .json({ error: "El correo y/o la contraseña son incorrectos" });
    }

    res.json({ login: true, userId: user.id });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const register = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(422).json({ errors: result.array() });
  }

  const { email, password } = req.body;
  try {
    const user = new User({
      email,
      password,
    });

    await user.save();

    res.json({ register: true, userId: user.id });
  } catch (error) {
    console.log(error);
    // if (error.code == 11000) {
    //   return res.status(500).json({ error: "Usuario duplicado" });
    // }
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  login,
  register,
};
