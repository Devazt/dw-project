'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_projects extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tb_projects.init({
    title: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    description: DataTypes.STRING,
    node_js: DataTypes.BOOLEAN,
    react_js: DataTypes.BOOLEAN,
    next_js: DataTypes.BOOLEAN,
    typescript: DataTypes.BOOLEAN,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tb_projects',
    timestamps: true,
    createdAt: true,
    updatedAt: true
  });
  return tb_projects;
};