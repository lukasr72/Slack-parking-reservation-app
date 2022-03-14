const { Op } = require('sequelize');

const {
  parkingMainView,
} = require('../user-interface/app-home');
const { User, Slot, Reservation } = require('../models');

module.exports = async (client, slackUserID, slackWorkspaceID, selectedDay) => {
  const todayDay = new Date();
  const date = new Date();

  date.setDate(todayDay.getDate() + selectedDay);

  try {
    const queryAllSlots = await Slot.findAll({
      include: [
        {
          model: Reservation,
          include: [User],
        }
      ],
      order: [['slotNumber', 'ASC']],
    });

    if (queryAllSlots.length === 0) {  // init slots
      for (let i = 1; i <= 1; i++) {
        let slot;
        slot = await Slot.build({ slotNumber: i, type: 'AM' });
        await slot.save();
        slot = await Slot.build({ slotNumber: i, type: 'PM' });
        await slot.save();
      }
    }

    const startDate = new Date(`${date.getFullYear()  }/${  date.getMonth() + 1  }/${  date.getDate()}`);
    const endDate = new Date(`${date.getFullYear()  }/${  date.getMonth() + 1  }/${  date.getDate() + 1}`);

    const queryReservedSlots = await Slot.findAll({
      include: [
        {
          model: Reservation,
          include: [User],
          where: {
            date: {
              [Op.between]: [startDate, endDate],
            }
          }
        }
      ],
      order: [['slotNumber', 'ASC']]
    });

    const reservedSlotsId = queryReservedSlots.map(slot => slot.id);
    const queryFreeSlots = queryAllSlots.filter(item => !reservedSlotsId.includes(item.id));

    const reservedSlotsByUser = await Slot.findAll({
      include: [
        {
          model: Reservation,
          include: [User],
          where: {
            date: {
              [Op.between]: [startDate, endDate],
            },
            UserId: slackUserID
          }
        }
      ],
      order: [['slotNumber', 'ASC']]
    });

    await client.views.publish({
      user_id: slackUserID,
      view: parkingMainView(queryFreeSlots, queryReservedSlots, selectedDay, reservedSlotsByUser),
    });

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};
