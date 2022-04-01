const { Modal, Blocks } = require('slack-block-builder');

function getPrettyDate(pDate) {
    return `${pDate.getDate()  }.${  pDate.getMonth() + 1  }.${  pDate.getFullYear()}`;
}

module.exports = (date) => Modal({ title: 'Slot is free' })
  .blocks(
    Blocks.Section({
      text: `Your slot is now free on ${getPrettyDate(date)}`,
    }),
  ).buildToJSON();
