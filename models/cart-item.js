const Sequelize = require('sequelize');

const sequelize = require('./utility/database');

const CartItem = sequelize.define('cartItem', {
  id: {
    type: Sequelize.STRING,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

module.exports = CartItem;