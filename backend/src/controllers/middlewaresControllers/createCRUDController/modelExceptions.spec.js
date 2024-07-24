const modelExceptions = require('./modelExceptions');
const sellerException = require('./exceptions/sellerException');

describe('modelExceptions Module', () => {
  test('test_modelExceptions_export', () => {
    expect(modelExceptions).toHaveProperty('User', sellerException);
  });
});