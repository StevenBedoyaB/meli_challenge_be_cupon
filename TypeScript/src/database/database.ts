import { Sequelize } from 'sequelize';

const sequelize: Sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'src/database/favorites.sqlite'
});

const db = {
    sequelize,
    favorites: require('../models/favorites.model')(sequelize)
};

module.exports = db;