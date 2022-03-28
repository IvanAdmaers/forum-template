/* eslint-disable no-undef */
const usersController = require('../usersController');

describe('usersController.registration', () => {
  it('should have a registration function', () => {
    expect(typeof usersController.registration).toBe('function');
  });
});
