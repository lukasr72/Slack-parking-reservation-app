const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      Reservation.belongsTo(models.Slot);
      Reservation.belongsTo(models.User);
    }

  }
  Reservation.init({
    // Model attributes are defined here
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  },
    {
      sequelize,
      modelName: 'Reservation',
    });
  return Reservation;
};
