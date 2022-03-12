const { Modal, Blocks } = require('slack-block-builder');

module.exports = (slot) => Modal({ title: 'Slot reserved', callbackId: 'slot-reserved-modal' })
  .blocks(
    Blocks.Section({
      text: `Success reservation of slot ${slot}`,
    }),
  ).buildToJSON();