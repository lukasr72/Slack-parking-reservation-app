module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Slots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      slotNumber: {        
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.ENUM('AM', 'PM'),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Slots');
  },
};
