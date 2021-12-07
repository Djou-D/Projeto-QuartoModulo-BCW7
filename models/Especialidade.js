const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Cada esquema é mapeado para uma coleção MongoDB e define a forma dos documentos dentro dessa coleção.
const Especialidade = new Schema({

  nome: 
  {
    type: String,
    require: true
  },

  descricao: 
  {
    type: String,
    require: true
  },

  data: 
  {
    type: Date,
    default: Date.now() //registra a data e hora da postagem 
  }
})

mongoose.model('especialidades', Especialidade)