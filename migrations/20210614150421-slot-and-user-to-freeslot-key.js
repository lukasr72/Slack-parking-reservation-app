module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'Freeslots',
      'slotId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Slots',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    )
      await queryInterface.addColumn(
        'Freeslots',
        'userId',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'Users',
            key: 'id',
          },
        },
      );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn(
      'Freeslots',
      'slotId',
    );
    await queryInterface.removeColumn(
      'Freeslots',
      'userId',
    );
  }
};
