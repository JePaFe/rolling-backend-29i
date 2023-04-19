require("dotenv").config();

const express = require("express");
const app = express();

const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("mongoose conectado"))
  .catch((err) => console.log(err));

// const usersRouter = require("./routes/users");

// const { saludar, mensaje } = require("./modulo");
// saludar();
// console.log(mensaje);

app.use(express.json()); // req.body

app.get("/", (req, res) => {
  res.send("Hola");
});

app.use("/api", require("./routes/users"));
app.use("/api", require("./routes/productos"));
app.use("/api", require("./routes/auth.router"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
