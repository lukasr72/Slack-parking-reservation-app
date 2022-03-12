const { Reservation } = require('../../models');
const { reloadAppHome } = require('../../utilities');

const freeSlotCallback = async ({ ack, action, client, body }) => {
  await ack();
  const reservationId = action.value.split('-')[0];
  let dateString = action.value.split('-')[1];
  dateString = Number(dateString);

  await Reservation.destroy({
    where: {
      id: reservationId
    },
  })
  await reloadAppHome(client, body.user.id, body.team.id, dateString);
};

module.exports = {
  freeSlotCallback,
};
