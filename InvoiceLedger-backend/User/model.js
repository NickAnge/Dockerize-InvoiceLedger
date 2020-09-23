//We must add 'updatedAt' and 'createdAt' because
//sequilize will look for these fields at our database

const Sequelize = require('sequelize');
const db = require('../database/config');

const User = db.define('user', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = User;