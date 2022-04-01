const { Freeslot} = require('../../models');
const { reloadAppHome } = require('../../utilities');
const {modals} = require("../../user-interface");

const cancelMyFreeslotCallback = async ({ ack, action, client, body }) => {
  await ack();
  const freeslotId = action.value.split('-')[0];
  let dateString = action.value.split('-')[1];
  dateString = new Date(dateString);
  dateString.setHours(dateString.getHours() + 4)

  const freeSlot = await Freeslot.findAll({
    where: {
      id: freeslotId,
      userId: null
    }
  })

  if (freeSlot.length === 0) {
    try {
      await ack();
      await client.views.open({
        trigger_id: body.trigger_id,
        view: modals.slotError("This slot is already reserved. You can not cancel it."),
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  } else {
    await Freeslot.destroy( { where: {id: freeslotId} })
  }

  await reloadAppHome(client, body.user.id, body.team.id, -1);
};

module.exports = {
  cancelMyFreeslotCallback,
};
