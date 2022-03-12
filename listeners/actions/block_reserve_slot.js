const {Reservation, User} = require('../../models');
const {reloadAppHome} = require('../../utilities');
const {modals} = require('../../user-interface');

const reserveSlotCallback = async ({ack, action, client, body}) => {
    await ack();

    const slotToUpdate = action.value.split('-')[2];
    let day = action.value.split('-')[3];
    day = Number(day);

    const todayDay = new Date();
    let date = new Date(todayDay.getFullYear() + '/' + (todayDay.getMonth() + 1) + '/' + todayDay.getDate() );

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
    const dateString = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();

    var queryUser = await User.findAll({
        where: {
            id: body.user.id
        }
    });

    let userId;
    if (queryUser.length === 0) {
        const user = User.build({ id: body.user.id, slackWorkspaceID: body.team.id, slackUsername: body.user.username });
        await user.save();
        userId = user.id;
    } else {
        userId = queryUser[0].dataValues.id;
    }

    let p_date = new Date(dateString);
    p_date.setHours(p_date.getHours() + 4);

    const existReservation = await Reservation.findAll({
        where: {
            SlotId: slotToUpdate,
            date: p_date
        }
    });

    if (existReservation.length === 0) {
        const reservation = await Reservation.build({date: p_date, UserId: userId, SlotId: slotToUpdate});
        await reservation.save();

        try {
            await ack();
            await client.views.open({
                trigger_id: body.trigger_id,
                view: modals.slotReserved(slotToUpdate),
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    } else {
        console.log('Stav slotu sa medzitým zmenil.');
        try {
            await ack();
            await client.views.open({
                trigger_id: body.trigger_id,
                view: modals.slotError(slotToUpdate),
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    }

    await reloadAppHome(client, body.user.id, body.team.id, day);
};

module.exports = {
    reserveSlotCallback,
};
