const { Op } = require('sequelize');

const {
  parkingMainView,
} = require('../user-interface/app-home');
const { User, Slot, Freeslot } = require('../models');

module.exports = async (client, slackUserID, pSlackWorkspaceID, selectedDay) => {
  const todayDay = new Date();

  if (selectedDay === -1) { // show my freeslots
    try {
      const today = new Date(`${todayDay.getFullYear()  }/${ todayDay.getMonth() + 1 }/${  todayDay.getDate()}`);
      const queryMyFreeslots = await Freeslot.findAll({
        include: [
          {
            model: User,
          },
          {
            model: Slot,
            include: [ {model: User, as: 'user'} ],
            where: {
              userId: slackUserID
            }
          }
        ],
        where: {
           date: {
              [Op.gte]: today
            }
        },
        order: [['date', 'ASC']]
      });

      await client.views.publish({
        user_id: slackUserID,
        view: parkingMainView([], [], selectedDay, queryMyFreeslots, slackUserID),
      });
      return

    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }


  const date = new Date();
  date.setDate(todayDay.getDate() + selectedDay);

  try {
    const startDate = new Date(`${date.getFullYear()  }/${  date.getMonth() + 1  }/${  date.getDate()}`);
    const endDate = new Date(`${date.getFullYear()  }/${  date.getMonth() + 1  }/${  date.getDate()}`);
    endDate.setDate(startDate.getDate() + 1);

    const queryFreeSlots = await Freeslot.findAll({
      include: [
        {
          model: User
        },
        {
          model: Slot,
          include: [{model: User, as: 'user'},]
        }
      ],
      where: {
        [Op.and]: [
          {userId: {[Op.is]: null}},
          {date: {[Op.between]: [startDate, endDate]}}
        ]
      }
    });

    const queryReservedSlots = await Freeslot.findAll({
      include: [
        {
          model: User
        },
        {
          model: Slot,
          include: [{model: User, as: 'user'},]
        }
      ],
        where: {
          date: {
            [Op.between]: [startDate, endDate],
          },
          userId: {
              [Op.not]: null,
          }
        }
    });

    await client.views.publish({
      user_id: slackUserID,
      view: parkingMainView(queryFreeSlots, queryReservedSlots, selectedDay, [], slackUserID),
    });

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};
