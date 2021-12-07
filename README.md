//Dependencias

npm init
  npm install mongodb
  npm install express
  npm install express-handlebars
  npm install body-parser
  npm install mongoose
  npm install express-session
  npm install connect-flash

  npm install bcryptjs
  npm install passport
    npm install passport-local //extrategia local do passport




//Estrutura de pastas e arquivos

  *raiz
    .gitignore
    app.js
    README.md

    package-lock.json
    package.json

    *config
      autenticacao.js

    *helpers  
      administrador.js
    

    *models
      Administrador.js

      Especialidade.js
      Medico.js

    
    *node_modules  


    *public
      *css
        style.css

      *js

      *img  


    *routes
      admin.js
      usuario.js  


    *views
      index.handlebars

      *admin
        login.handlebars

        cadmedico.handlebars
        muralespecialidade.handlebars
        muralmedico.handlebars

        cadadministrador.handlebars
        cadespecialidade.handlebars

      *categorias
        

      *layouts
        main.handlebars


      *partils
        msg.handlebars
        
        navbar.handlebars 
        footer.handlebars 


      *usuarios
        
   


