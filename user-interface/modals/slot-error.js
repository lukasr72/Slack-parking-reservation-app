const { Modal, Blocks } = require('slack-block-builder');

module.exports = (message) => Modal({ title: 'Error', callbackId: 'slot-error-modal' })
  .blocks(
    Blocks.Section({
      text: message,
    }),
  ).buildToJSON();