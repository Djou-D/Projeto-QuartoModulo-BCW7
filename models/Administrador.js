const mongoose = require('mongoose')
const Schema = mongoose.Schema


// Cada esquema é mapeado para uma coleção MongoDB e define a forma dos documentos dentro dessa coleção.
const Administrador = new Schema({

  nome: 
  {
    type: String,
    require: true
  },

  email: 
  {
    type: String,
    require: true
  },

  // QUANDO O VALOR DE ADMIN FOR DEFAULT = 0, ELE SERÁ UM USUARIO COMUM, QUANDO FOR DEAFAULT = 1 ELE SERÁ ADMIN
  administrador: 
  {
    type: Number,
    default: 0
  },

  senha: 
  {
    type: String,
    require: true
  }

})

mongoose.model('administradores', Administrador)