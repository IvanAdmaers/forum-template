/**
 * This function defined produciton mode
 *
 * @returns {boolean} True if production
 */
const isProduction = () => process.env.NODE_ENV === 'production';

export default isProduction;
