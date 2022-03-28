/**
 * This functions check if mode is equals to production
 *
 * @function isProduction
 * @returns {Boolean} True is production
 */
const isProduction = () => process.env.NODE_ENV === 'production';

module.exports = isProduction;
