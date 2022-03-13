const { Modal, Blocks } = require('slack-block-builder');

module.exports = (slot) => Modal({ title: 'Reservation error', callbackId: 'slot-error-modal' })
  .blocks(
    Blocks.Section({
      text: `Slot ${slot} reservation failed! Try again.`,
    }),
  ).buildToJSON();