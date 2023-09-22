const Sequelize = require('sequelize')

// Conexão com o banco de dados Postgres
const sequelize = new Sequelize('NodeExpress', 'postgres', 'Timbo93', {
    host: 'localhost',
    port: 2904,
    dialect: 'postgres'
})

// Exportando o módulo inteiro e suas constantes
module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}