require('dotenv').config();
const { WebClient } = require('@slack/client');

const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

module.exports = {
  web,
};
