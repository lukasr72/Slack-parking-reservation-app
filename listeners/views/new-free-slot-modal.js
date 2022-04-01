const {Freeslot, Slot, User} = require('../../models');
const {modals} = require('../../user-interface');
const {reloadAppHome} = require('../../utilities');

const newFreeSlotModalCallback = async ({ack, view, body, client}) => {
    const providedValues = view.state.values;

    const selectedDate = providedValues.freeSlotDate.freeSlotDate.selected_date;

    try {
        const ownSlot = await Slot.findAll({
            include: [
                {model: User, as: 'user'},
            ],
            where: {userId: body.user.id}
        });

        if (selectedDate !== null) {
            const selectedDatePlusHour = new Date(selectedDate)
            selectedDatePlusHour.setHours(selectedDatePlusHour.getHours() + 1)

            const today = new Date()
            today.setDate(today.getDate() - 1)
            if(selectedDatePlusHour < today) {
                throw new Error('Error. You can not set slot as free.')
            }

            const isFree = await Freeslot.findAll({
                where: {
                    date: selectedDatePlusHour,
                    slotId: ownSlot[0].id
                }})

            if(isFree.length !== 0) {
                throw new Error('Your slot is already free.')
            }


            const freeSlot = await Freeslot.build({date: selectedDatePlusHour, slotId: ownSlot[0].id});
            await freeSlot.save();
        }


        await ack({
            response_action: 'update',
            view: modals.slotAsFree(new Date(selectedDate)),
        });

        await reloadAppHome(client, body.user.id, body.team.id, -1);
    } catch (error) {
        await ack({
            response_action: 'update',
            view: modals.slotError(error.message),
        });
        // eslint-disable-next-line no-console
        console.error(error);
    }
};

module.exports = {newFreeSlotModalCallback};
