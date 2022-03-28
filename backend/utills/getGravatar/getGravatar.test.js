/* eslint-disable no-undef */
const getGravatar = require('./getGravatar');

const cases = [
  {
    email: 'test@gmail.com',
    hash: '1aedb8d9dc4751e229a335e371db8058',
  },
  {
    email: 'tcook@apple.com',
    hash: '4a18f04b20237635b43cde490853a66e',
  },
];

describe('getGravatar', () => {
  it('should be a function', () => {
    expect(typeof getGravatar).toBe('function');
  });

  it('should returns a correct url', () => {
    const { email, hash } = cases[0];

    const url = `https://www.gravatar.com/avatar/${hash}`;

    expect(getGravatar(email)).toBe(url);
  });

  it('should returns a correct url', () => {
    const { email, hash } = cases[1];

    const url = `https://www.gravatar.com/avatar/${hash}`;

    expect(getGravatar(email)).toBe(url);
  });
});
