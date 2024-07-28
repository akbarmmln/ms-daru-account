const Sequelize = require('sequelize');
const dbConnection = require('../config/db').Sequelize;

const adrAccountView = dbConnection.define('AccountView', {
	nama: Sequelize.STRING,
	kk: Sequelize.STRING,
	mobile_number: Sequelize.STRING,
	email: Sequelize.STRING,
	alamat: Sequelize.STRING,
	blok: Sequelize.STRING,
	nomor_rumah: Sequelize.STRING,
	rt: Sequelize.STRING,
	rw: Sequelize.STRING,
	organitation_id: Sequelize.STRING,
	position_id: Sequelize.STRING,
}, {
	timestamps: false,
	tableName: 'AccountView'
});
adrAccountView.removeAttribute('id');
module.exports = adrAccountView;