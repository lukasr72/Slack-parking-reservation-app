const { Modal, Blocks } = require('slack-block-builder');

module.exports = () => Modal({ title: 'Slot reserved', callbackId: 'slot-reserved-modal' })
  .blocks(
    Blocks.Section({
      text: `Reservation successful`,
    }),
  ).buildToJSON();