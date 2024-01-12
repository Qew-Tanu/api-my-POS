const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('railway', 'postgres', 'dg1G32ee6243*CDGfB3b2-b-fbFdE3*G', {
//     host: 'monorail.proxy.rlwy.net',
//     dialect: 'postgres',
//     logging: false
// });
const sequelize = new Sequelize('postgresql://postgres:dg1G32ee6243*CDGfB3b2-b-fbFdE3*G@monorail.proxy.rlwy.net:56076/railway', { logging: false })


module.exports = sequelize;