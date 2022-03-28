/**
 * This function triggers a socket event
 *
 * @param {Object} req - Express req
 * @param {string} event - Socket event name
 * @param {any} data - Event data
 * @returns {boolean} True if everything ok
 */
const triggerSocketEvent = (req = {}, event = '', data) => {
  const io = req.app.get('io');

  io.engine.emit(event, data);

  return true;
};

module.exports = triggerSocketEvent;
