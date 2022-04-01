const {Modal, Blocks, Elements } = require('slack-block-builder');

module.exports = (prefilledSlot) => {
    if (!prefilledSlot) {
        return Modal({title: 'Manage my slot'})
            .blocks(
                Blocks.Section({text: `You do not own any slot.`}),
            ).buildToJSON();
    }

    return Modal({title: 'Manage my slot', submit: 'Apply', callbackId: 'new-free-slot-modal'})
        .blocks(
            Blocks.Section({text: `Your number of slot is *${prefilledSlot.slotNumber}*`}),

            Blocks.Input({ label: 'Set your slot as free', blockId: 'freeSlotDate' }).element(
                Elements.DatePicker({
                    actionId: 'freeSlotDate',
                }),
            )
        ).buildToJSON();
    
}
