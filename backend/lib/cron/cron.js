const nodeCron = require('node-cron');
const cleanTokens = require('../cleanTokens');

/**
 * This function runs cron tasks
 */
const cron = () => {
  // Every day at 2:30 AM
  nodeCron.schedule('30 2 * * *', () => {
    cleanTokens();
  });
};

module.exports = cron;
