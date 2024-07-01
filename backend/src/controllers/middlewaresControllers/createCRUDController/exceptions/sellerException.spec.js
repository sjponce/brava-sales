const userExceptions = require('./sellerException');
const { create, update } = userExceptions;

describe('userExceptions', () => {
  describe('create.emailExists', () => {
    it('should return a failure message if the email already exists in the database', async () => {
      const Model = {
        findOne: jest.fn().mockResolvedValue({ email: 'test@example.com', removed: false }),
      };
      const req = { body: { email: 'test@example.com' } };
      const result = await create.emailExists(Model, req);
      expect(result).toEqual({
        success: false,
        result: null,
        message: 'Este email ya esta en uso.',
      });
    });

    it('should return null if the email does not exist in the database', async () => {
      const Model = {
        findOne: jest.fn().mockResolvedValue(null),
      };
      const req = { body: { email: 'new@example.com' } };
      const result = await create.emailExists(Model, req);
      expect(result).toBeNull();
    });
  });

  describe('update.emailExists', () => {
    it('should return a failure message if the email already exists and belongs to a different user', async () => {
      const Model = {
        findOne: jest.fn().mockResolvedValue({ _id: '123', email: 'test@example.com', removed: false }),
      };
      const req = { body: { email: 'test@example.com' }, params: { id: '456' } };
      const result = await update.emailExists(Model, req);
      expect(result).toEqual({
        success: false,
        result: null,
        message: 'Este email ya esta en uso.',
      });
    });
  });
});