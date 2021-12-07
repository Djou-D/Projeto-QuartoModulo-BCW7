const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')


// MODEL DE ADMIN
require('../models/Administrador')
const Administrador = mongoose.model('administradores')




module.exports = function(passport){


  // PasswordFild: 'senha' é pra que o name senha seja indentificado, traduz para o passport
  passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'}, (email, senha, done) => {

    Administrador.findOne({email: email}).then((usuario) => {
      if(!usuario){
        return done(null, false, {message: 'Esta conta não existe'})
      
      }

      bcrypt.compare(senha, usuario.senha, (erro, iguais) => {
        if(iguais){
          return done(null, usuario)

        } else {

          return done(null, false, {message: 'Senha incorreta'})
        }
      })
    })
  }))


  // salva os dados do usuario em uma sessão
  passport.serializeUser((usuario, done) => {

    done(null, usuario.id)
  })

  passport.deserializeUser((id, done) => {
    Administrador.findById(id, (err, usuario) => {
      done(err, usuario)
    })
  })
}