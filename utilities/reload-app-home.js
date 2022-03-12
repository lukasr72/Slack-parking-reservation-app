const { Op } = require('sequelize');

const {
  parkingMainView,
} = require('../user-interface/app-home');
const { User, Slot, Reservation } = require('../models');

module.exports = async (client, slackUserID, slackWorkspaceID, selectedDate) => {
  let day = selectedDate;
  if (selectedDate === '') {
    day = 1;
  }

  const todayDay = new Date();
  let date = new Date();

  switch (day) {
    case 1:
      date.setDate(todayDay.getDate()); break;
    case 2:
      date.setDate(todayDay.getDate() + 1); break;
    case 3:
      date.setDate(todayDay.getDate() + 2); break;
    case 4:
      date.setDate(todayDay.getDate() + 3); break;
    case 5:
      date.setDate(todayDay.getDate() + 4); break;
  }

  try {
    const allSlots = await Slot.findAll();
    if (allSlots.length === 0) {
      for (let i = 1; i <= 20; i++) {
        let slot;
        slot = await Slot.build({ slotNumber: i, type: 'AM' });
        await slot.save();
        slot = await Slot.build({ slotNumber: i, type: 'PM' });
        await slot.save();
      }
    }

    const startDate = new Date(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate());
    const endDate = new Date(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + (date.getDate() + 1));

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

    const queryAllSlots = await Slot.findAll({
      include: [
        {
          model: Reservation,
          include: [User],
        }
      ],
      order: [['slotNumber', 'ASC']],
    });

    let reservedSlotsId = queryReservedSlots.map(slot => slot.id);
    var queryFreeSlots = queryAllSlots.filter(item => !reservedSlotsId.includes(item.id));

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
      view: parkingMainView(queryFreeSlots, queryReservedSlots, selectedDate, reservedSlotsByUser),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};
