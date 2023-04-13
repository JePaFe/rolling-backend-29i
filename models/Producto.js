const { Schema, model } = require("mongoose");

const schema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  descripcion: String,
  precio: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
});

module.exports = model("Producto", schema);
