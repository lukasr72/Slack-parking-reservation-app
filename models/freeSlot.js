const {
    Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Freeslot extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */

        static associate(models) {
            Freeslot.belongsTo(models.Slot);
            Freeslot.belongsTo(models.User);
        }

    }
    Freeslot.init({
            // Model attributes are defined here
            date: {
                type: DataTypes.DATE,
                allowNull: false,
            }
        },
        {
            sequelize,
            modelName: 'Freeslot',
        });
    return Freeslot;
};
