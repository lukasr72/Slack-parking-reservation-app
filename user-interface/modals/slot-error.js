const { Modal, Blocks } = require('slack-block-builder');

module.exports = () => Modal({ title: 'Reservation error', callbackId: 'slot-error-modal' })
  .blocks(
    Blocks.Section({
      text: `Slot reservation failed! Please choose another slot.`,
    }),
  ).buildToJSON();