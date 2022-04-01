const { newFreeSlotModalCallback } = require('./new-free-slot-modal');

module.exports.register = (app) => {
    app.view('new-free-slot-modal', newFreeSlotModalCallback);
};
