//Model for Delivery Notes

const Sequelize = require('sequelize');
const db = require('../database/config');

const DeliveryNote = db.define('deliveryNote', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    job: {
        type: Sequelize.STRING,
        allowNull: false
    },
    VATRegistrationNum: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false
    },
    loadingPlace: {
        type: Sequelize.STRING,
        allowNull: false
    },
    taxOffice: {
        type: Sequelize.STRING,
        allowNull: false
    },
    destination: {
        type: Sequelize.STRING,
        allowNull: false
    },
    details: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
        defaultValue: []
    },
    file: {
        type: Sequelize.STRING,
        allowNull: true
    },
    coordinates: {
        type: Sequelize.STRING,
        allowNull: true
    }
})

module.exports = DeliveryNote;