const {
  HomeTab, Header, Divider, Section, Actions, Elements, Input, Bits,
} = require('slack-block-builder');
const pluralize = require('pluralize');
const { DateTime } = require('luxon');

module.exports = (freeSlots, reservedSlots, selectedDate, reservedSlotsByUser) => {
  const todayDay = new Date();
  var second = new Date(); second.setDate(todayDay.getDate() + 1);
  var third = new Date(); third.setDate(todayDay.getDate() + 2);
  var fourth = new Date(); fourth.setDate(todayDay.getDate() + 3);
  var fifth = new Date(); fifth.setDate(todayDay.getDate() + 4);

  const primaryFlag = selectedDate;

  function getPrettyDate(pDate) {
    return pDate.getDate() + '.' + (pDate.getMonth() + 1) + '.' + pDate.getFullYear();
  }

  const homeTab = HomeTab({ callbackId: 'slots-home', privateMetaData: '' }).blocks(
    Actions({ blockId: 'slot-creation-actions' }).elements(
      Elements.Button({ text: getPrettyDate(todayDay) }).value('app-home-nav-first-day').actionId('app-home-nav-first-day').primary(primaryFlag === 1),
      Elements.Button({ text: getPrettyDate(second) }).value('app-home-nav-second-day').actionId('app-home-nav-second-day').primary(primaryFlag === 2),
      Elements.Button({ text: getPrettyDate(third) }).value('app-home-nav-third-day').actionId('app-home-nav-third-day').primary(primaryFlag === 3),
      Elements.Button({ text: getPrettyDate(fourth) }).value('app-home-nav-fourth-day').actionId('app-home-nav-fourth-day').primary(primaryFlag === 4),
      Elements.Button({ text: getPrettyDate(fifth) }).value('app-home-nav-fifth-day').actionId('app-home-nav-fifth-day').primary(primaryFlag === 5),
    ),
  );

  if (freeSlots.length === 0) {
    homeTab.blocks(
      Header({ text: 'No free slots' }),
      Divider(),
      Section({ text: ':(' }),
    );
    return homeTab.buildToJSON();
  }

  const freeSlotsList = freeSlots.map((slot) => {
    const dayPart = slot.type === 'AM' ? '06:00 - 12:00' : '12:00 - 18:00'
    const plainText = `:green_slot: *Slot ${slot.slotNumber} | ${slot.type} | ${dayPart}* \n _This slot is free._`;

    if (reservedSlotsByUser.length === 0 || reservedSlotsByUser[0].slotNumber === slot.slotNumber) {
      return Section({
        text: plainText,
      }).accessory(
        Elements.Button({ text: `Reserve ${slot.slotNumber} | ${slot.type}` })
          .value(`open-slot-${slot.id}-${selectedDate}`)
          .actionId('reserve-slot'),
      );
    } else {
      return Section({
        text: plainText,
      });
    }
  });

  const reservedSlotsList = reservedSlots.map((slot) => {
    const dayPart = slot.type === 'AM' ? '06:00 - 12:00' : '12:00 - 18:00'
    const slotIdsOfUserReservations = reservedSlotsByUser.map(item => item.id);
    const plainText = `:red_slot: *Slot ${slot.slotNumber} | ${slot.type} | ${dayPart}* \n _${slot.Reservations[0].User.slackUsername}_`;

    if (slotIdsOfUserReservations.includes(slot.id)) {
      return Section({
        text: plainText,
      }).accessory(
        Elements.Button({ text: 'Free' })
          .value(`${slot.Reservations[0].id}-${selectedDate}`)
          .actionId('free-slot')
          .danger(true),
      );
    } else {
      return Section({
        text: plainText,
      });
    }
  });

  homeTab.blocks(
    Header({ text: `You have ${freeSlots.length} parking ${pluralize('option', freeSlots.length)}` }),
    Divider(),
    freeSlotsList,
    Divider(),
    Header({ text: `We have ${reservedSlots.length} reserved ${pluralize('slot', reservedSlots.length)}` }),
    reservedSlotsList
  );

  return homeTab.buildToJSON();
};
