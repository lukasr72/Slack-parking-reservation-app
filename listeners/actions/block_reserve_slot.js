const {Op} = require('sequelize');
const {Freeslot, User} = require('../../models');
const {reloadAppHome} = require('../../utilities');
const {modals} = require('../../user-interface');

const reserveSlotCallback = async ({ack, action, client, body}) => {
    await ack();

    const freeSlotId = action.value.split('-')[2];
    let day = action.value.split('-')[3];
    day = Number(day);

    const todayDay = new Date();
    const date = new Date(`${todayDay.getFullYear()}/${todayDay.getMonth() + 1}/${todayDay.getDate()}`);

    date.setDate(todayDay.getDate() + day);

    const dateString = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

    try {
        const queryUser = await User.findAll({
            where: {
                id: body.user.id
            }
        });

        let pUserId;
        if (queryUser.length === 0) {
            const user = User.build({
                id: body.user.id,
                slackWorkspaceID: body.team.id,
                slackUsername: body.user.username
            });
            await user.save();
            pUserId = user.id;
        } else {
            pUserId = queryUser[0].dataValues.id;
        }


        const existReservation = await Freeslot.findAll({
            where: {
                [Op.and]: [
                    {id: freeSlotId},
                    {userId: {[Op.is]: null}}
                ]
            }
        });

        const pDate = new Date(dateString);
        pDate.setHours(pDate.getHours() + 3); // TODO na oracle len +1

        const usersReservations = await Freeslot.findAll({
            where: {
                [Op.and]: [
                    {date: pDate},
                    {userId: pUserId}
                ]
            }
        })

        if (usersReservations.length > 0) {
            throw new Error('Slot reservation failed! You already have reservations on this day.')
        }

        if (existReservation.length === 1) {
            await Freeslot.update({userId: pUserId}, {where: {id: freeSlotId}})

            try {
                await ack();
                await client.views.open({
                    trigger_id: body.trigger_id,
                    view: modals.slotReserved(),
                });
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
            }
        } else {
            throw new Error('Slot reservation failed! Please choose another slot.')
        }

    } catch (err) {
        try {
            await ack();
            await client.views.open({
                trigger_id: body.trigger_id,
                view: modals.slotError(err.message),
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
