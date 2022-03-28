/* eslint-disable no-undef */
const sanitizePost = require('./sanitizePost');

describe('sanitizePost', () => {
  it('should be a fucntion', () => {
    expect(typeof sanitizePost).toBe('function');
  });

  it('should returns an string', () => {
    expect(typeof sanitizePost('')).toBe('string');
  });
});
