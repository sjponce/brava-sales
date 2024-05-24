import { login, register, logout } from './auth.service.js';
import axios from 'axios';
import { jest } from '@jest/globals';

jest.mock('axios');

describe('Auth Function Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('test_login_successful', async () => {
    const mockData = {
      data: {
        success: true,
        message: 'Login successful',
        user: { id: 1, name: 'John Doe' }
      },
      status: 200
    };
    axios.post.mockResolvedValue(mockData);

    const loginData = { username: 'john', password: '123456' };
    const response = await login({ loginData });

    expect(response).toEqual(mockData.data);
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('login'),
      loginData
    );
  });

  test('test_register_server_error', async () => {
    const mockError = {
      response: {
        data: {
          success: false,
          message: 'Error registering user'
        },
        status: 500
      }
    };
    axios.post.mockRejectedValue(mockError);

    const registerData = { username: 'jane', password: '654321' };
    const response = await register({ registerData });

    expect(response).toEqual(mockError.response.data);
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('register'),
      registerData
    );
  });

  test('test_logout_with_credentials', async () => {
    const mockData = {
      data: {
        success: true,
        message: 'Logout successful'
      },
      status: 200
    };
    axios.post.mockResolvedValue(mockData);

    const response = await logout();

    expect(response).toEqual(mockData.data);
    expect(axios.defaults.withCredentials).toBe(true);
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('logout')
    );
  });
});