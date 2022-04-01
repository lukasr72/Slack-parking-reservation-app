const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      User.hasOne(models.Slot, { foreignKey: 'userId' });
      User.hasMany(models.Freeslot, { foreignKey: 'userId' });
    }
  }
  User.init({
    id: {
      primaryKey: true,
      type: DataTypes.STRING,
      allowNull: false,
    },
    slackOrganizationID: {
      type: DataTypes.STRING,
    },
    slackWorkspaceID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slackUsername: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
