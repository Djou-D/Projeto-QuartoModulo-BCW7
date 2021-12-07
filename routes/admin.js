// CARREGANDO MODULOS
const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')

// HASHES PARA A SENHA, É USADO PARA OBTER NUMEROS ALEATORIOS SEGUROS.
// INPORTANDO O BCRYPTJS
const bcrypt = require('bcryptjs')

const passport = require('passport')

// CARREGANDO OS MODULOS CRIADOS COM OS MODELOS PRO BANCO DE DADOS
require('../models/Administrador')
const Administrador = mongoose.model('administradores')

require('../models/Especialidade')
const Especialidade = mongoose.model('especialidades')

require('../models/Medico')
const Medico = mongoose.model('medicos')


// dentro do objeto administrador só quero pegar a função administrador.
// colar administrador nas rotas protegidas para adms
const {administrador} = require('../helpers/administrador')
const {ObjectId} = require('bson')


//////////////////////////////////////////////////////////////////////////

// ROTAS

// CADASTRO DE USUARIOS

router.get('/cadastro', administrador, (req, res) => {

  res.render('admin/cadadministrador') })

router.post('/cadastro', administrador, (req, res) => {

  // VARIAVEL ARRAY PARA ARMAZENAR OS RESULTADOS DA VALIDAÇÃO
  var erros = []


  // VALIDANDO O NOME
  if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){

    erros.push({texto: 'Nome inválida'})
  }

  // VALIDANDO O EMAIL
  if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){

    erros.push({texto: 'E-mail inválida'})
  }

  // VALIDANDO A SENHA
  if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){

    erros.push({texto: 'Senha inválida'})
  }

  // ESTIPULANDO NUMERO MINIMO DE CARACTERES PARA A SENHA
  if(req.body.senha.length < 4){

    erros.push({texto: 'Senha muito curta'})
  }

  // COMPARANDO AS SENHAS
  if(req.body.senha != req.body.senha2){

    erros.push({texto: 'As senha são diferentes, tente novamente'})
  }

  if(erros.length > 0){

    res.render('admin/cadadministrador', {erros: erros})

  } else {

    Administrador.findOne({email: req.body.email}).then((administrador) =>{

      if(administrador){
        req.flash('error_msg', 'Já existe uma conta com este e-mail registrada')

        res.redirect('/admin/cadadministrador')

      } else {
          const administradornovo = new Administrador({
            nome: req.body.nome,
            email: req.body.email,
            senha: req.body.senha
          })

          // o salt é um valor aleatorio que vai ser misturado ao hash para gerar uma senha segura
          bcrypt.genSalt(10, (erro, salt) => {
            bcrypt.hash(administradornovo.senha, salt, (erro, hash) => {

            if(erro){

              res.redirect('/')

              req.flash('error_msg', 'Houve um erro durante o salvamento do usuário')

            }

            // pegando a senha do novo usuario e atribuindo o hash criado acima.
            administradornovo.senha = hash

            administradornovo.save().then(() => {
              res.redirect('/')

              req.flash('success_msg', "Administrador registrado com sucesso!")

            }).catch((err) => {
              res.redirect('/admin/cadadministrador')

              req.flash('error_msg', 'Houve um erro ao criar o admin, tente novamente')
            })
          })

        })

      }

    }).catch((err) => {
      res.redirect('/')

      req.flash('error_msg', 'Houve um erro interno')
    })
  }
})

/////////////////////////////////////////////////////////////////////////

// LOGIN E LOGOUT DO ADM

router.get('/login', (req, res) => {

  res.render('login')
})

router.post('/login', (req, res, next) => {

  passport.authenticate('local', {
    successRedirect: '/usuarios/medicos',
    failureRedirect: '/admin/login',
    failureFlash: true

  })(req, res, next)


})


router.get('/logout', (req, res) => {

  // FUNÇÃO DO PASSPORT QUE GARANTE O LOGOUT
  req.logout()

  req.flash('success_msg', 'Volte sempre!')
  res.redirect('/')
})

// FIM DO LOGIN/LOGOUT

///////////////////////////////////////////////////////////////////////////////////

// ESPECIALIDADES

// LISTA AS ESPECIALIDADES
router.get('/especialidades', (req, res) => {

  Especialidade.find().sort({date: 'desc'}).then((especialidades) => {

  res.render('admin/muralespecialidade', {
    especialidades: especialidades.map(Especialidade => Especialidade.toJSON())
  })

  }).catch((err) => {

    req.flash('error_msg', 'Houve um erro ao listar as especialidades')

    res.redirect('/')
  })
})


router.get('/especialidades/add', administrador, (req, res) => {

  res.render('admin/cadespecialidade')
})


router.post('/especialidades/nova', administrador, (req, res) => {

  // validação do formulario
  var erros = []


  // IF PARA DIRECIONAR O FORMULARIO PARA CRIAR UMA NOVA ESPECIALIDADE OU PARA EDITAR A ESPECIALIDADE
  if(req.body.id == ""){

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){

      erros.push({text: 'Nome invalido'})
    }

      if(req.body.nome.length < 2){

        erros.push({texto: 'Nome da especialidade é muito pequeno'})
      }


        if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){

          erros.push({texto:'Descrição invalido'})
        }


          if(req.body.descricao.length < 20){

            erros.push({texto: 'Descrição da especialidade é muito pequeno'})
          }


            if(erros.length > 0){

              res.render('admin/cadespecialidade', {erros: erros})

            } else {

              const especialidadeNova = {

                nome: req.body.nome,
                descricao: req.body.descricao

              }

              new Especialidade(especialidadeNova).save().then(() => {

              req.flash('success_msg', 'Especialidade cadastrada com sucesso!')

              res.redirect('/admin/especialidades')

              }).catch((err) => {
              req.flash('error_msg', 'Houve um erro ao salvar a especialidade')

              res.redirect('/admin/cadespecialidade/add')
              })
            }

  } else {

    Especialidade.findOne({_id: req.body.id}).then((especialidade) => {

      especialidade.nome = req.body.nome,
      especialidade.descricao = req.body.descricao,

      especialidade.save().then(() => {
          req.flash('success_msg', "Especialidade editada com sucesso!")

          res.redirect('/admin/especialidades')

      }).catch((err) => {
          req.flash('error_msg', 'Erro interno ao salvar a edição da especialidade')

          res.redirect('/admin/especialidades')
      })

    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao salvar a edição')

        console.log(err)
        res.redirect('/admin/especialidades')

    })

  }

})


// EDIÇÃO DE ESPECIALIDADE 
router.get('/especialidade/edit/:id', administrador, (req, res) => {

  // o método then () retorna uma promise, tem doi argumentos um para o sucesso e o outro para o erro podendo ser encadeado com o catch () que é o caso aqui.
  Especialidade.findOne({_id: req.params.id}).lean().then((especialidade) => {

    res.render('admin/cadespecialidade', {especialidade: especialidade})

    // O método catch () retorna uma Promise e lida apenas com case rejeitados.
  }).catch((err) => {
    req.flash('error_msg', "Houve um erro ao listar as especialidades")

    res.redirect('/admin/especialidades')
  })

})



// DELETANDO ESPECIALIDADE
router.post('/especialidade/delete', administrador, (req, res) => {

  Especialidade.deleteOne({_id: req.body.id}).then(() => {

    req.flash('success_msg', 'Especialidade deletada com sucesso')

    res.redirect('/admin/especialidades')

  }).catch((err) => {
    req.flash('error_msg', 'Houve um erro ao deletar a especialidade')

    res.render('/admin/especialidades')
  })
})



////////////////////////////////////////////////////////////////////////////////  

// CADASTRANDO E EDITANDO MÉDICOS

router.get('/medicos', administrador, (req, res) => {

  Medico.find().populate('especialidade').sort({data: 'desc'}).then((med) => {

    res.render('admin/muralmedico', {medicos: med.map(Medico => Medico.toJSON())})

  }).catch((err) => {
    console.log(err)
    req.flash('error_msg', 'Houve um erro ao listar os Médicos')

    res.redirect('/admin/medicos')
  })
})


router.get('/medicos/add', administrador, (req, res) => {
  Especialidade.find({}).lean().then((especialidade) => {
    res.render('admin/cadmedico', {especialidade: especialidade})

  }).catch((err) => {
      req.flash('error_msg', 'Houve um erro ao carregar o formulario')

      res.redirect('/admin/medicos/add')
  })
})

router.post('/medicos/nova', administrador, (req, res) => {

  var erro = []

  if(req.body.id == ""){

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
      erro.push({texto: 'Nome invalido'})
    }

    if(!req.body.crm || typeof req.body.crm == undefined || req.body.crm == null){
      erro.push({texto: 'CRM inválido'})
    }

    if(!req.body.cpf || typeof req.body.cpf == undefined || req.body.cpf == null){
      erro.push({texto: 'CPF invalida'})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
      erro.push({texto: 'Email invalida'})
    }

    if(!req.body.sexo || typeof req.body.sexo == undefined || req.body.sexo == null){
      erro.push({texto: 'Sexo invalida'})
    }

    if(req.body.cpf.length != 11){
      erro.push({texto: 'CPF invalido'})
    }

    if(req.body.nome.length < 2){
      erro.push({texto: 'Nome muito pequeno'})
    }

    if(req.body.especialidade == "0"){
      erro.push({texto: 'Especialidade inválida, registre uma especialidade'})
    }

    if(erro.length > 0){

      res.render('admin/cadmedico', {erro: erro})

    } else {

        const medicoNovo = {
          nome: req.body.nome,
          crm: req.body.crm,
          cpf: req.body.cpf,
          email: req.body.email,
          sexo: req.body.sexo,
          especialidade: req.body.especialidade
        }

        new Medico(medicoNovo).save().then(() => {
          req.flash('success_msg', 'Médico cadastrado com sucesso!')

          res.redirect('/admin/medicos')

        }).catch((err) => {
          req.flash('error_msg', 'Houve um erro durante o cadastro do médico')

          res.redirect('/admin/medicos')
        })

    }

  } else {

    Medico.findOne({_id: req.body.id}).then((medico) => {

      medico.nome = req.body.nome,
      medico.crm = req.body.crm,
      medico.cpf = req.body.cpf,
      medico.email = req.body.email,
      medico.sexo = req.body.sexo
      medico.especialidade = req.body.especialidade

      medico.save().then(() => {
        req.flash('success_msg', "Médico editada com sucesso!")

        res.redirect('/admin/medicos')

      }).catch((err) => {
        req.flash('error_msg', 'Erro interno')

        res.redirect('/admin/medicos')
      })

    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao salvar a edição')

      res.redirect('/admin/medicos')

    })

  }
})



// ESSA ROTA ESTA PESQUISANDO DADOS DE DUAS COLLECTIONS DIFERENTES AO MESMO TEMPO, PARA RENDERIZALOS NA PAGINA DE DESTINO
router.get('/medicos/edit/:id', administrador, (req, res) => {

  Medico.findOne({_id: req.params.id}).lean().then((medico) => {

    Especialidade.find().lean().then((especialidade) => {

      res.render('admin/cadmedico', {medico: medico, especialidade: especialidade})

    }).catch((err) => {
      req.flash('error_msg', "Houve um erro ao listar as especialidades")

      res.redirect('/admin/medicos')
    })


  }).catch((err) => {
    req.flash('error_msg', "Houve um erro ao carregar o formúlario de edição")

    res.redirect('/admin/medicos')
  })
})


////////////////////////////////////////////////////////////////////////////////


// DELETANDO ESPECIALIDADE
// Na pagína do botão de deletar, criar um form com o botão dentro, passando a rota no action do form.
router.post('/medicos/delete', administrador, (req, res) => {

  Medico.deleteOne({_id: req.body.id})
    .then(() => {

      req.flash('success_msg', 'Médico deletada com sucesso')

      res.redirect('/admin/medicos')

    }).catch((err) => {
      req.flash('error_msg', 'Houve um erro ao deletar o médico')

    res.render('/admin/muralmedico')
  })
})



//////////////////////////////////////////////////////////////
// PESQUISA MÉDICOS
// router.get('/pesquisarMedicos', (req, res) => {
//   Medico.find({}, (erro, resultado) => {
//     if (erro) throw erro;
//     res.render('admin/muralmedico', {
//       nome: resultado
//     })
//   })
// })

// router.post('/pesquisarMedicos', (req, res) => {
//   const nomeMedico = req.body.pesquisa
//   const nomeMedicoRegex = new RegExp(nomeMedico, "i")

//   Medico.find({
//     nome: nomeMedicoRegex
//   }).then((medicos) => {

//     res.render('admin/muralmedico', {
//       medicos: medicos.map(Medico => Medico.toJSON())
//     })
//   }).catch((err) => {

//     req.flash('error_msg', 'Houve um erro ao listar os médicos')

//     res.redirect('/')
//   })
// })


router.get('/pesquisarMedicos', (req, res) => {
  Medico.find()
    .populate('especialidade')
    .sort({
      data: 'desc'
    })
    .then(medicos => {
      res.render('admin/muralmedico', {
        medicos: medicos.map(Medico => Medico.toJSON())
      })
    })
    .catch(err => {
      console.log(err)
      req.flash('error_msg', 'Houve um erro ao listar os Médicos')

      res.redirect('/admin/muralmedico')
    })
})

router.post('/pesquisarMedicos', (req, res) => {
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

          res.render('admin/muralmedico', {

            especialidade: especialidade.map(Especialidade =>
              Especialidade.toJSON()
            ),

            medicos: medicos.map(Medico => Medico.toJSON())
          })
        })
        .catch(err => {
          req.flash('error_msg', 'Nenhuma especialidade encontrada')

          res.redirect('/admin/muralmedico')
        })
        .catch(err => {
          req.flash('error_msg', 'Nenhum Médico encontrado')

          res.redirect('/admin/medicos')
        })
    })
})


////////////////////////////////////////////////////////////////////////////////
// PESQUISA ESPECIALIDADES
router.get('/pesquisarEspecialidade', (req, res) => {
  Especialidade.find({}, (erro, resultado) => {
    if (erro) throw erro;

    res.render('muralespecialidade', {
      nome: resultado
    })
  })
})

router.post('/especialidades/pesquisarEspecialidade', (req, res) => {
  const nomeEspecialidade = req.body.pesquisa
  const nomeEspecialidadeRegex = new RegExp(nomeEspecialidade, "i")

  Especialidade.find({
    nome: nomeEspecialidadeRegex
  }).then((especialidades) => {

    res.render('admin/muralespecialidade', {
      especialidades: especialidades.map(Especialidade => Especialidade.toJSON())
    })
  }).catch((err) => {

    req.flash('error_msg', 'Houve um erro ao listar as especialidades')

    res.redirect('/')
  })


  //   Especialidade.find({nome: nomeEspecialidadeRegex}, (erro, resultado)=>{
  //       if(erro) throw erro;
  // console.log(resultado)
  //       res.render('admin/muralespecialidade', {especialidades:resultado})
})

// EXPORTANDO O MODULO ROTAS ADMIN
module.exports = router