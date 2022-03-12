module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn(
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
    queryInterface.removeColumn(
      'Reservations',
      'UserId',
    );
    queryInterface.removeColumn(
      'Reservations',
      'SlotId',
    );
  }
};
