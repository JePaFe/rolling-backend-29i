const { validationResult } = require("express-validator");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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

    const token = jwt.sign({ uid: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ login: true, userId: user.id, token });
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

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(422).json({ error: "No existe el usuario" });
    }

    const secret = process.env.JWT_SECRET + user.password;

    const token = jwt.sign({ uid: user.id }, secret, { expiresIn: "1m" });

    var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const link = `http://localhost:5173/reset/${user.id}?token=${token}`;

    let emailOptions = {
      from: "forgot@x.com",
      to: user.email,
      subject: "Forgot password",
      html: `
        <h1>Forgot password</h1>
        <a href="${link}">Reset password</a>
      `,
    };

    transporter.sendMail(emailOptions, function (err, data) {
      if (err) {
        return res.status(500).json({ err });
      }

      return res.json({
        user,
        link,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(422).json({ error: "No existe el usuario" });
    }

    const secret = process.env.JWT_SECRET + user.password;

    const verified = jwt.verify(token, secret);

    console.log(verified);

    if (verified) {
      user.password = password;
      await user.save();
    }

    res.json({
      user,
      verified,
    });
  } catch (error) {
    console.log(error);

    if (error.message == "jwt expired") {
      return res.status(500).json({ error: "Token expirado" });
    }

    if (error.message == "invalid token") {
      return res.status(500).json({ error: "Token no valido" });
    }

    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword,
};
