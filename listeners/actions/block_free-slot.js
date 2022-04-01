const { Freeslot} = require('../../models');
const { reloadAppHome } = require('../../utilities');

const freeSlotCallback = async ({ ack, action, client, body }) => {
  await ack();
  const freeslotId = action.value.split('-')[0];
  let dateString = action.value.split('-')[1];
  dateString = Number(dateString);

  await Freeslot.update({userId: null}, { where: {id: freeslotId} })

  await reloadAppHome(client, body.user.id, body.team.id, dateString);
};

module.exports = {
  freeSlotCallback,
};
