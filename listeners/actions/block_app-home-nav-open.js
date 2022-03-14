const reloadAppHome = require('../../utilities/reload-app-home');

const appHomeNavOpenCallback = async ({ body, ack, client }) => {
  try {
    await ack();
    await reloadAppHome(client, body.user.id, body.team.id, 0);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

const appHomeFirstCallback = async ({ body, ack, client }) => {
  try {
    await ack();
    await reloadAppHome(client, body.user.id, body.team.id, 0);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

const appHomeSecondCallback = async ({ body, ack, client }) => {
  try {
    await ack();
    await reloadAppHome(client, body.user.id, body.team.id, 1);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

const appHomeThirdCallback = async ({ body, ack, client }) => {
  try {
    await ack();
    await reloadAppHome(client, body.user.id, body.team.id, 2);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

const appHomeFourthCallback = async ({ body, ack, client }) => {
  try {
    await ack();
    await reloadAppHome(client, body.user.id, body.team.id, 3);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

const appHomeFifthCallback = async ({ body, ack, client }) => {
  try {
    await ack();
    await reloadAppHome(client, body.user.id, body.team.id, 4);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

module.exports = {
  appHomeNavOpenCallback,
  appHomeFirstCallback,
  appHomeSecondCallback,
  appHomeThirdCallback,
  appHomeFourthCallback,  
  appHomeFifthCallback
};
