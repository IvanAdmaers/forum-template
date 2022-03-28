/* eslint-disable no-undef */
const md5 = require('./md5');

const cases = {
  hello: '5d41402abc4b2a76b9719d911017c592',
  dream123: 'ff9d58f24885b124808ae7246302b9fb',
};

describe('md5', () => {
  it('should be a function', () => {
    expect(typeof md5).toBe('function');
  });

  it('should returns correct md5 hash', () => {
    const thisCase = 'hello';

    expect(md5(thisCase)).toBe(cases[thisCase]);
  });

  it('should returns correct md5 hash', () => {
    const thisCase = 'dream123';

    expect(md5(thisCase)).toBe(cases[thisCase]);
  });
});
