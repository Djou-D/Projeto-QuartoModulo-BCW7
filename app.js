// CARREGAMENTO DE MÓDULOS
const express = require('express')
const app = express() //estanciando o express

const handlebars = require('express-handlebars')
const session = require('express-session')

const bodyParser = require('body-parser')
const path = require('path')

const mongoose = require('mongoose')

const flash = require('connect-flash')
const { readFileSync } = require('fs')

const passport = require('passport')



// importando rotas
const admin = require('./routes/admin')
const usuario = require('./routes/usuario')


// PASSANDO O ARQUIVO DE AUTENTICAÇÃO PARA O PASSPORT
// necessario para validar os acessos do user e do admin
require('./config/autenticacao')(passport)




// CONFIGURAÇÕES

  // SESSÃO

  // USADO PARA ARMAZENAR COOKIES DE INFORMAÇÕES DE USUARIOS ATRAVEZ DE ID
    app.use(session({
      secret: 'projetonode', //Segurança de acesso, para criptografar o sessionId

      resave: true, //informar ao armazenamento de sessão que uma determinada sessão ainda está ativa

      saveUninitialized: true //identificar visitantes recorrentes, por exemplo. Você seria capaz de reconhecer tal visitante porque ele envia o cookie de sessão contendo o id único.
    
    }))
    // definição do passport
    app.use(passport.initialize())
    app.use(passport.session())
    // definição do flash
    app.use(flash())



  // MIDDLEWARE
  app.use((req, res, next) => {

    // definições de variaveis globais para mensagens de erros e sucessos das validações do site
  res.locals.success_msg = req.flash('success_msg')

  res.locals.error_msg = req.flash('error_msg')

  res.locals.error = req.flash('error')

  // vai armazenar os dados do usuario logado, req.user armazena os dados, é criado pelo passport, se nenhum ususario logado retorna null
  res.locals.user = req.user || null

   // para seguir nas requisições
   next()
})


  // BODY-PARSER

    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())


  // HANDLEBARS
    
    const hbs = handlebars.create({
      partialsDir: 'views/partials/',
    })

    app.engine('handlebars', hbs.engine)
    app.set('view engine', 'handlebars')


  // MONGOOSE

    mongoose.Promise = global.Promise

    mongoose.connect('mongodb+srv://EquipeNode:12345@cluster0.adzfd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority').then(() => {

      console.log('Conectado ao servidor MongoDB')

    }).catch((err) => {

      console.log(`Erro ao se conectar: ${err}`)
    })


  // PUBLIC

    app.use(express.static(path.join(__dirname, 'public')))


// ROTAS

app.get('/', (req, res) => {
  
  res.render('login')
})



//rotas do administrador
app.use('/admin', admin)

// rotas do usuario
app.use('/usuarios', usuario)



// PORTA E ESCULTA
const port = 8080
app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})

