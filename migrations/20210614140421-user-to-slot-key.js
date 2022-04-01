module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'Slots',
      'userId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
          allowNull: true,
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    )
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn(
      'Slots',
      'userId',
    );
  }
};
