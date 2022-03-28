/**
 * This function defines request user agent
 *
 * @function defineUserAgent
 * @param {object} req - Express req
 * @returns {string} Request user agent or unknown
 */
const defineUserAgent = (req) => {
  let userAgent = req.headers['user-agent'] || '';

  // Special case of UC Browser
  if (req.headers['x-ucbrowser-ua']) {
    userAgent = req.headers['x-ucbrowser-ua'];
  }

  if (!userAgent) {
    userAgent = 'unknown';
  }

  return userAgent;
};

// Middleware
// eslint-disable-next-line arrow-body-style
const userAgentMiddleware = () => {
  return (req, res, next) => {
    const userAgent = defineUserAgent(req);

    req.userAgent = userAgent;

    return next();
  };
};

module.exports = userAgentMiddleware;
