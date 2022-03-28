/* eslint-disable no-undef */
const isProduction = require('./isProduction');

describe('isProduction', () => {
  it('should be a function', () => {
    expect(typeof isProduction).toBe('function');
  });
});
