/* eslint-disable no-undef */
const isTheSameDomain = require('./isTheSameDomain');

describe('isTheSameDomain', () => {
  it('should be a function', () => {
    expect(typeof isTheSameDomain).toBe('function');
  });

  describe('valid', () => {
    it('https://google.com & https://google.com', () => {
      expect(isTheSameDomain('https://google.com', 'https://google.com')).toBe(
        true
      );
    });

    it('https://google.co.uk & https://google.co.uk', () => {
      expect(
        isTheSameDomain('https://google.co.uk', 'https://google.co.uk')
      ).toBe(true);
    });
  });

  it('https://google.co & http://google.co', () => {
    expect(isTheSameDomain('https://google.com', 'http://google.com')).toBe(
      true
    );
  });
});
