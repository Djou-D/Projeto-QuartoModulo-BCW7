Projeto final do modulo de nodejs do Bootcamp BCW7 da SoulCode Academy.

Equipe:

Dionatam Lima,

Eduardo Oliveira,

Mariana paz,

Rauny Lima


Diretrizes do projeto:


Desenvolva um sistema para um hospital com 2 perfis de acesso:

ADM – CRUD para médicos e especialidades.

Observação: Ao cadastrar médico, associar a uma especialidade já cadastrada no banco de dados.

USER - Consegue listar os médicos por especialidade e realizar pesquisa por nome de médico ou especialidade.


Requisitos:

Estilizar;
Usar Banco de Dados MongoDB;



**Dependencias ultilizadas no projeto

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

    npm install passport-local  => extrategia local do passport




**Estrutura de pastas e arquivos

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
      login.handlebars

      *admin
        cadadministrador.handlebars
        cadespecialidade.handlebars
        cadmedico.handlebars
        muralespecialidade.handlebars
        muralmedico.handlebars

      *categorias
        

      *layouts
        main.handlebars


      *partils
        msg.handlebars
        
        navbar.handlebars 
        footer.handlebars 


      *usuarios
        especialidades.handlebars
        medicos.handlebars
        
   


