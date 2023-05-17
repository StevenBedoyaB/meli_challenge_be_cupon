import { DataTypes } from 'sequelize';

module.exports = (sequelize) => {
    return sequelize.define('favorites', {
        item_id: DataTypes.STRING,
        freq: DataTypes.FLOAT
    })
};