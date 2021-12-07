// ESPORTANDO AS DEPENDENCIAS DA PÁGINA
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// DEFININDO O MODULO DA PÁGINA
const Medico = new Schema({
  
  nome:
  {
    type: String,
    required: true
  },

  crm: 
  {
    type: String,
    required: true
  },

  cpf: 
  {
    type: Number,
    required: true
  },

  email: 
  {
    type: String,
    required: true
  },

  sexo: 
  {
    type: String,
    require: true,
    // DESTACANDO OS VALORES POSSIVEIS PARA O INPUT RADIO 
    possibleValues: ['masculino', 'feminino', 'outros']
  },

  // ARMAZENANDO O ID DE UMA CATEGORIA
  especialidade: 
  {
    // REFERENCIANDO UMA CATEGORIA JÁ EXISTENTE, ARMAZENANDO O ID DESSA CATEGORIA
    type: Schema.Types.ObjectId, 
    // NOME DO MODULO QUE QUEREMOS ARMAZENAR
    ref: 'especialidades',
    required: true,
  },

  data: 
  {
    type: Date,
    default: Date.now()
  }
})

// DEFININDO O MODEL
mongoose.model('medicos', Medico)