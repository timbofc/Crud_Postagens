const express = require('express');
const app = express();
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const Post = require('./models/Post');
const { sequelize } = require('./models/db');

//Config
    // Template Engine (é um processador de template que gera a página HTML com diversas funções)
    // Criando a formatação do handlebars com essa linha. O padrão html no arquivo main será utilizado como padrão de layout para todos os outros arquivos da view    
    const hbs = handlebars.create({
        defaultLayout: 'main',
        runtimeOptions: {
          allowProtoPropertiesByDefault: true,
          allowProtoMethodsByDefault: true
        },
        helpers: {
          formatDate: function (date) {
            // Formate a data como desejado
            const options = { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit',
              timeZoneName: 'short' // Para incluir o fuso horário
            };
            return new Date(date).toLocaleDateString('pt-BR', options);
          }
        }
      });
    
    app.engine('handlebars', hbs.engine)
    app.set('view engine', 'handlebars');
    // Body Parser (serve para coletar os dados quem vem do formulario)
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())
   
//Rotas
    app.get('/', (req,res) => {
        const msgConfirmacao = req.query.mensagem;        
        Post.findAll({order: [['id', 'DESC']]}).then((posts) => {
            res.render('home', {posts: posts, msgConfirmacao})
        })
    })

    app.get('/cad', (req, res) => {      
        res.render('formulario')
    })

    app.post('/add', (req,res) => {
        const msgCadastro = encodeURIComponent('Postagem cadastrada com sucesso.')
        Post.create({
            titulo: req.body.titulo,
            conteudo: req.body.conteudo
        }).then(() => {
            res.redirect(`/?mensagem=${msgCadastro}`)
        }).catch((erro) => {
            res.send('Houve um erro: ' + erro)
        })
    })

    app.get('/delete/:id', (req,res) => {
        Post.destroy({where: {'id': req.params.id}}).then(() => {
            console.log('Postagem deletada com sucesso.')
            const msgCadastro = encodeURIComponent('Postagem deletada com sucesso.')
            res.redirect(`/?mensagem=${msgCadastro}`)                        
        }).catch((erro) => {
            console.log('O erro encontrado foi ' + erro)            
        })        
    })

    app.get('/edit/:id', (req,res) => {        
        const id = req.params.id
        Post.findByPk(id).then((result) => {
            res.render('edit', {row: result})
        }).catch((err) => {
            console.log('Aconteceu o seguinte erro: ' + err)
        })
    })

    app.post('/edit/:id', (req, res) => {
        const msgEdit = encodeURIComponent('Postagem editada com sucesso.')
        const { id } = req.params
        const { titulo, conteudo } = req.body
        const updateData = {
            titulo: titulo,
            conteudo: conteudo
        }
        const options = {
            where: {id: id}
        }     

        Post.update(updateData, options).then(() => {
            res.redirect(`/?mensagem=${msgEdit}`)
        }).catch((err) => {
            console.log('Aconteceu o seguinte erro: ' + err)
        })
    })

app.listen(3333, () => {
    console.log('Server ON in localhost:3333')
})