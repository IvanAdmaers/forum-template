/**
 * This function masks email
 * Based on https://gist.github.com/gukandrew/04e18deaa7b3318832ff0873a2a58c6f
 *
 * @param {string} email - Email
 * @param {string} [maskSymbol=*] - Symbol to mask (optional)
 * @returns {string} Masked email
 */
const maskEmail = (email = '', maskSymbol = '*') => {
  let prev = '';

  const masked = [...email].map((char, index) => {
    const isFirstChar = index === 0;
    const isSpecial = char === '.' || char === '@';
    const isAfterSpecial = prev === '.' || prev === '@';
    const umask = isFirstChar || isSpecial || isAfterSpecial ? char : null;
    prev = char;

    return umask || maskSymbol;
  });

  return masked.join('');
};

module.exports = maskEmail;
