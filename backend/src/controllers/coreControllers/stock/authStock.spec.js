const axios = require('axios');
const jwt = require('jsonwebtoken');
const { authStock } = require('./authStock');
const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

jest.mock('axios');
jest.mock('jsonwebtoken');

describe('authStock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axios.post.mockReset();
    stockToken = null;
    tokenExpiration = null;
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  test('test_authentication_request_failure', async () => {
    axios.post.mockRejectedValue(new Error('Authentication failed'));

    await expect(authStock()).rejects.toThrow('Ocurrió un error contactando a Stock');
    expect(axios.post).toHaveBeenCalledWith(`${process.env.STOCK_API}/user/login`, {
      userName: process.env.STOCK_USERNAME,
      password: process.env.STOCK_SECRET,
    });
  });

  test('test_fetch_new_token', async () => {
    const newToken = 'newToken';
    const decodedToken = { exp: Math.floor(Date.now() / 1000) + 60 }; // Token valid for 60 seconds

    axios.post.mockResolvedValue({ data: { Token: newToken } });
    jwt.decode.mockReturnValue(decodedToken);

    const token = await authStock();

    expect(token).toBe(newToken);
    expect(axios.post).toHaveBeenCalledWith(`${process.env.STOCK_API}/user/login`, {
      userName: process.env.STOCK_USERNAME,
      password: process.env.STOCK_SECRET,
    });
    expect(jwt.decode).toHaveBeenCalledWith(newToken);
  });

  test('test_return_existing_token', async () => {
    stockToken = 'newToken';
    tokenExpiration = Date.now() + 10000; // Token is valid for another 10 seconds

    const token = await authStock();

    expect(token).toBe('newToken');
  });
});
