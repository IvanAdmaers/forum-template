const { URL } = require('url');

/**
 * This function adds params to url
 *
 * @param {stirng} url - Url
 * @param  {...any} params - Params. E.g. url, param1, param1value, param2, param2value
 */
const addParamsToUrl = (url = '', ...params) => {
  const myUrl = new URL(url);

  for (let i = 0; i < params.length; i += 2) {
    const param = params[i];
    const value = params[i + 1];

    myUrl.searchParams.append(param, value);
  }

  return myUrl.toString();
};

module.exports = addParamsToUrl;
