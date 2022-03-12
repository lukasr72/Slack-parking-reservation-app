const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Slot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      Slot.hasMany(models.Reservation, { foreignKey: 'SlotId' });
    }
  }
  Slot.init({
    // Model attributes are defined here
    slotNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },    
    type: {
      type: DataTypes.ENUM,
      values: ['AM', 'PM'],
    },
  },
  {
    sequelize,
    modelName: 'Slot',
  });
  return Slot;
};
