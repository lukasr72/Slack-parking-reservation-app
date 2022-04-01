const { appHomeNavOpenCallback,
  appHomeFirstCallback,
  appHomeSecondCallback,
  appHomeThirdCallback,
  appHomeFourthCallback,
  appHomeFifthCallback,
  appHomeMyFreeslotsCallback } = require('./block_app-home-nav-open');

const { freeSlotCallback } = require('./block_free-slot');
const { reserveSlotCallback } = require('./block_reserve_slot');
const { cancelMyFreeslotCallback } = require('./block_cancel-my-freeslot');
const { appHomeNavManageCallback } = require('./block_app-home-nav-manage');

module.exports.register = (app) => {
  app.action(
    { action_id: 'app-home-nav-open', type: 'block_actions' },
    appHomeNavOpenCallback,
  );
  app.action(
    { action_id: 'app-home-nav-first-day', type: 'block_actions' },
    appHomeFirstCallback,
  );
  app.action(
    { action_id: 'app-home-nav-second-day', type: 'block_actions' },
    appHomeSecondCallback,
  );
  app.action(
    { action_id: 'app-home-nav-third-day', type: 'block_actions' },
    appHomeThirdCallback,
  );
  app.action(
    { action_id: 'app-home-nav-fourth-day', type: 'block_actions' },
    appHomeFourthCallback,
  );
  app.action(
    { action_id: 'app-home-nav-fifth-day', type: 'block_actions' },
    appHomeFifthCallback,
  );
  app.action(
      { action_id: 'app-home-nav-my-freeslots', type: 'block_actions' },
      appHomeMyFreeslotsCallback,
  );

  app.action(
    { action_id: 'free-slot', type: 'block_actions' },
    freeSlotCallback,
  );
  app.action(
    { action_id: 'reserve-slot', type: 'block_actions' },
    reserveSlotCallback,
  );
  app.action(
      { action_id: 'cancel-my-freeslot', type: 'block_actions' },
      cancelMyFreeslotCallback,
  );

  app.action('app-home-nav-manage', appHomeNavManageCallback);
};
