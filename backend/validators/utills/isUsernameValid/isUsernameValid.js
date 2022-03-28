const params = {
  min: 3,
  max: 20,
  regExp: /^[A-Za-z0-9_]+$/,
  prohibitedWordsRegExps: [
    /admin/i,
    /boss/i,
    /support/i,
    /nigger/i,
    /account/i,
  ],
};

const isUsernameValid = (un = '') => {
  const result = { isValid: true, message: '' };

  const withError = (message = '') => ({ isValid: false, message });

  const username = un.trim();

  const usernameLength = username.length;

  if (usernameLength < params.min) {
    return withError(
      `Username cannot be shorter than ${params.min} characters`
    );
  }

  if (usernameLength > params.max) {
    return withError(`Username cannot be longer than ${params.max} characters`);
  }

  if (!username.match(params.regExp)) {
    return withError('Allowed symbols A-z, 0-9 and _');
  }

  const regExps = params.prohibitedWordsRegExps;

  for (let i = 0; i < regExps.length; i += 1) {
    const regExp = regExps[i];

    const regexText = `${regExp}`.split('/')[1];

    if (username.match(regExp)) {
      return withError(`Username cannot contain a word ${regexText}`);
    }
  }

  return result;
};

module.exports = isUsernameValid;
