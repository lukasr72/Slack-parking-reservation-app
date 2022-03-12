module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        primaryKey: true,
        type: Sequelize.STRING,
        allowNull: false,
      },
      slackOrganizationID: {
        type: Sequelize.STRING,
      },
      slackWorkspaceID: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slackUsername: {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.dropTable('Users');
  },
};
