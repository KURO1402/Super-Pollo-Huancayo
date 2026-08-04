require('dotenv').config();
const PushNotifications = require('@pusher/push-notifications-server');

const beamsClient = new PushNotifications({
  instanceId: process.env.BEAMS_INSTANCE_ID,
  secretKey: process.env.BEAMS_SECRET_KEY,
});

module.exports = beamsClient;