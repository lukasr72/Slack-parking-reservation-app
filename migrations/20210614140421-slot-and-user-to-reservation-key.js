module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'Reservations',
      'UserId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    ),
      await queryInterface.addColumn(
        'Reservations',
        'SlotId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Slots',
            key: 'id',
          },
        },
      );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn(
      'Reservations',
      'UserId',
    );
    await queryInterface.removeColumn(
      'Reservations',
      'SlotId',
    );
  }
};
