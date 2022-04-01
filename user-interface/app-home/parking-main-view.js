const {
  HomeTab, Header, Divider, Section, Actions, Elements
} = require('slack-block-builder');
const pluralize = require('pluralize');

module.exports = (freeSlots, reservedSlots, selectedDate, freeSlotsByUserRaw, slackUserID) => {
  const todayDay = new Date();
  const second = new Date();
  second.setDate(todayDay.getDate() + 1);

  const third = new Date();
  third.setDate(todayDay.getDate() + 2);

  const fourth = new Date();
  fourth.setDate(todayDay.getDate() + 3);

  const fifth = new Date();
  fifth.setDate(todayDay.getDate() + 4);

  const primaryFlag = selectedDate;

  function getPrettyDate(pDate) {
    return `${pDate.getDate()  }.${  pDate.getMonth() + 1  }.${  pDate.getFullYear()}`;
  }

  const homeTab = HomeTab({ callbackId: 'slots-home', privateMetaData: '' }).blocks(
    Actions({ blockId: 'slot-creation-actions' }).elements(
      Elements.Button({ text: getPrettyDate(todayDay) }).value('app-home-nav-first-day').actionId('app-home-nav-first-day').primary(primaryFlag === 0),
      Elements.Button({ text: getPrettyDate(second) }).value('app-home-nav-second-day').actionId('app-home-nav-second-day').primary(primaryFlag === 1),
      Elements.Button({ text: getPrettyDate(third) }).value('app-home-nav-third-day').actionId('app-home-nav-third-day').primary(primaryFlag === 2),
      Elements.Button({ text: getPrettyDate(fourth) }).value('app-home-nav-fourth-day').actionId('app-home-nav-fourth-day').primary(primaryFlag === 3),
      Elements.Button({ text: getPrettyDate(fifth) }).value('app-home-nav-fifth-day').actionId('app-home-nav-fifth-day').primary(primaryFlag === 4),
      Elements.Button({ text: "Set as free :pencil2:" }).value('app-home-nav-manage').actionId('app-home-nav-manage').danger(true),
      Elements.Button({ text: "My free :green_slot:" }).value('app-home-nav-my-freeslots').actionId('app-home-nav-my-freeslots').danger(true),
    ),
  );

  const freeSlotsList = freeSlots.map((item) => {
    const freeSlot = item.Slot
    const plainText = `:green_slot: *Slot ${freeSlot.slotNumber}* is free \n _:prince: Owner: ${freeSlot.user.slackUsername}_`;

    if (freeSlot.userId !== slackUserID) {
      return Section({
        text: plainText,
      }).accessory(
        Elements.Button({ text: `Reserve slot ${freeSlot.slotNumber}` })
          .value(`open-slot-${item.id}-${selectedDate}`)
          .actionId('reserve-slot')
      );
    }
    
    return Section({
      text: plainText,
    });
  });

  const reservedSlotsList = reservedSlots.map((freeSlot) => {
    const slot = freeSlot.Slot
    const plainText = `:red_slot: *Slot ${slot.slotNumber} | reserved by ${freeSlot.User.slackUsername} * \n _:prince: Owner: ${slot.user.slackUsername}_`;

    if (slackUserID === freeSlot.userId) {
      return Section({
        text: plainText,
      }).accessory(
        Elements.Button({ text: 'Cancel' })
          .value(`${freeSlot.id}-${selectedDate}`)
          .actionId('free-slot')
          .danger(true)
      );
    }
    
    return Section({
      text: plainText,
    });
  });

  function getOnlyDate(pDate) {
    return `${pDate.getFullYear()}/${pDate.getMonth() + 1}/${pDate.getDate()}`;
  }
  const freeslotsByUser = freeSlotsByUserRaw.map((item) => {
    const freeSlot = item.Slot
    const plainText = `:red_slot: *Slot ${freeSlot.slotNumber} | Is free on ${getPrettyDate(item.date)}* \n _:prince: Owner: ${freeSlot.user.slackUsername}_`;

    return Section({
      text: plainText,
    }).accessory(
        Elements.Button({ text: 'Cancel' })
            .value(`${item.id}-${getOnlyDate(item.date)}`)
            .actionId('cancel-my-freeslot')
            .danger(true)
    );
  });

  if (selectedDate === -1) {
    homeTab.blocks(
        Header({ text: `You have ${freeSlotsByUserRaw.length} ${pluralize('incident', freeSlotsByUserRaw.length)}` }),
        freeslotsByUser,
    );
    return homeTab.buildToJSON();
  }

  if (freeSlots.length === 0) {
    homeTab.blocks(
        Header({ text: 'No free slots' }),
        Divider(),
        Section({ text: ':disappointed:' }),
        Divider(),
        Header({ text: `We have ${reservedSlots.length} ${pluralize('reservation', reservedSlots.length)}` }),
        reservedSlotsList,
    );
    return homeTab.buildToJSON();
  }

  homeTab.blocks(
    Header({ text: `We have ${freeSlots.length} free ${pluralize('slot', freeSlots.length)}` }),
    Divider(),
    freeSlotsList,
    Divider(),
    Header({ text: `We have ${reservedSlots.length} ${pluralize('reservation', reservedSlots.length)}` }),
    reservedSlotsList,
  );

  return homeTab.buildToJSON();
};
