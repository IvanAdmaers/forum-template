/* eslint-disable no-undef */
const { Types } = require('mongoose');

const toObjectId = require('./toObjectId');

describe('toObjectId', () => {
  it('should be a function', () => {
    expect(typeof toObjectId === 'function').toBe(true);
  });

  it('should be a valid object id', () => {
    const objectId = toObjectId('60d19d74f6ba440aa6c09f75');

    expect(Types.ObjectId.isValid(objectId)).toBe(true);
  });
});
