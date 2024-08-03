const Sequelize = require('sequelize');
const dbConnection = require('../config/db').Sequelize;

const allAccounts = dbConnection.define('allAccounts', {
    created_dt: Sequelize.DATE(6),
    nama: Sequelize.STRING,
    kk: Sequelize.STRING,
    mobile_number: Sequelize.STRING,
    email: Sequelize.INTEGER,
    alamat: Sequelize.STRING,
    blok: Sequelize.STRING,
    nomor_rumah: Sequelize.STRING,
    rt: Sequelize.STRING,
    rw: Sequelize.STRING,
    organitation_id: Sequelize.STRING,
    position_id: Sequelize.STRING,
}, {
  freezeTableName: true,
  timestamps: false,
  tableName: 'allAccounts'
});
allAccounts.removeAttribute('id');

module.exports = allAccounts;