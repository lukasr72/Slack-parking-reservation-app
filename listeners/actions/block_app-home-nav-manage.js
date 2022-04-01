const { modals } = require('../../user-interface');
const { User, Slot } = require("../../models");

const appHomeNavManageCallback = async ({ body, ack, client }) => {
  try {
    await ack();

    const queryPrefilledSlot = await Slot.findAll({
      include: [
        {
          model: User, as: "user"
        },
      ],
      where: {
          userId: body.user.id
      }
    })
    const prefilledSlot = queryPrefilledSlot[0]

    await client.views.open({
      trigger_id: body.trigger_id,
      view: modals.manageDash(prefilledSlot),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

module.exports = {
  appHomeNavManageCallback,
};
