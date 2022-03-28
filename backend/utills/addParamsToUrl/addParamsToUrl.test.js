/* eslint-disable no-undef */
const addParamsToUrl = require('./addParamsToUrl');

describe('addParamsToUrl', () => {
  it('should be a function', () => {
    expect(typeof addParamsToUrl).toBe('function');
  });

  it('should returns a correct url', () => {
    const url = 'https://google.com';
    const expectUrl = 'https://google.com/?q=hi';

    expect(addParamsToUrl(url, 'q', 'hi')).toBe(expectUrl);
  });

  it('should returns a correct url', () => {
    const url = 'https://google.com/?q=hi';
    const expectUrl = 'https://google.com/?q=hi&locale=en-US&year=2021';

    expect(addParamsToUrl(url, 'locale', 'en-US', 'year', 2021)).toBe(
      expectUrl
    );
  });
});
