/// USER ANTIFO - 03/12/2021
// const express = require('express')
// const router = express.Router()

// const mongoose = require('mongoose')

// PUXANDO O MODELS DO ADM
// require('../models/Administrador')
// const Administrador = mongoose.model('administradores')

// PUXANDO O MODELS DO MÉDICO
// require('../models/Medico')
// const Medico = mongoose.model('medicos')


// ROTAS
// router.get('/medicos', (req, res) => {
  
//   Medico.find().populate('especialidade').sort({data: 'desc'}).then((med) => {

//     res.render('usuarios/medicos', {medicos: med.map(Medico => Medico.toJSON())})

//   }).catch((err) => {
//     console.log(err)
//     req.flash('error_msg', 'Houve um erro ao listar os Médicos')

//     res.redirect('/usuarios/medicos')
//   })
 
// })

// module.exports = router

/// USER NOVO 04/12/2021

const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')

// PUXANDO O MODELS DO MÉDICO
require('../models/Medico')
const Medico = mongoose.model('medicos')

//  PUXANDO O MODELS DAS ESPECIALIDADES
require('../models/Especialidade')
const Especialidade = mongoose.model('especialidades')

// ROTAS

//////////////////////////////////////////////////////////////
// PESQUISA MÉDICOS
router.get('/medicos', (req, res) => {
  Medico.find()
    .populate('especialidade')
    .sort({
      data: 'desc'
    })
    .then(medicos => {
      res.render('usuarios/medicos', {
        medicos: medicos.map(Medico => Medico.toJSON())
      })
    })
    .catch(err => {
      console.log(err)
      req.flash('error_msg', 'Houve um erro ao listar os Médicos')

      res.redirect('/usuarios/medicos')
    })
})

router.post('/medicos', (req, res) => {
  const nomeMedico = req.body.pesquisa
  const nomeEspecialidade = req.body.pesquisa
  const nomeMedicoRegex = new RegExp(nomeMedico, 'i')
  const nomeEspecialidadeRegex = new RegExp(nomeEspecialidade, 'i')

  Medico.find({
    nome: nomeMedicoRegex
  })
    .populate('especialidade')
    .sort({
      data: 'desc'
    })
    .then(medicos => {
      Especialidade.find({ 
        nome: nomeEspecialidadeRegex 
      })
        .then(especialidade => {

          res.render('usuarios/medicos', {

            especialidade: especialidade.map(Especialidade =>
              Especialidade.toJSON()
            ),

            medicos: medicos.map(Medico => Medico.toJSON())
          })
        })
        .catch(err => {
          req.flash('error_msg', 'Nenhuma especialidade encontrada')

          res.redirect('/usuarios/medicos')
        })
        .catch(err => {
          req.flash('error_msg', 'Nenhum Médico encontrado')

          res.redirect('/usuarios/medicos')
        })
    })
})

router.post('/especialidades', (req, res)=>{
  const nomeEspecialidade = req.body.pesquisa
  const nomeEspecialidadeRegex = new RegExp(nomeEspecialidade, 'i')

Especialidade.findOne({nome:nomeEspecialidadeRegex}).lean().then(resultado =>{
  Medico.find({especialidade: resultado}).lean().then(resultado2 =>{
    // console.log(resultado)
    // console.log(resultado2)
    res.render('usuarios/especialidades',{
      resultado,
      resultado2
      
    })
  })
})
})

module.exports = router