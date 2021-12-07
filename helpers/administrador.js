
module.exports = {
  
  // Essa função é um controle de acesso as contas, as rotas marcadas com administrador só serão acessadas por usuarios adms
  administrador: function(req, res, next){

    if(req.isAuthenticated() && req.user.administrador == 1){

      return next()
    }

      req.flash('error_msg', 'Essa seção é exclusiva para administradores')

      res.redirect('/admin/login')
  }

}