import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import SellersDataTable from './SellersDataTable';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '@/redux/rootReducer';
import { request } from '@/request';

const mockDelete = jest.fn().mockResolvedValue({
  message: 'Se elimino el elemento',
  success: true,
});

const mockListAll = jest.fn().mockResolvedValue({
  message: 'Se encontró todos los elementos',
  result: [
    {
      _id: '1',
      name: 'John',
      surname: 'Doe',
      email: 'john@example.com',
      role: 'admin',
      phone: '123456789',
      enabled: true,
      photo: '',
    },
    {
      _id: '2',
      name: 'Jane',
      surname: 'Doe',
      email: 'jane@example.com',
      role: 'seller',
      phone: '987654321',
      enabled: false,
      photo: '',
    },
  ],
  success: true,
});

const initialState = {
  crud: {
    listAll: {
      result: {
        items: {
          result: [
            {
              _id: '1',
              name: 'John',
              surname: 'Doe',
              email: 'john@example.com',
              role: 'admin',
              phone: '123456789',
              enabled: true,
              photo: '',
            },
          ],
        },
      },
      isLoading: false,
      isSuccess: true,
    },
    read: { isLoading: false },
    create: { isLoading: false },
    update: { isLoading: false },
    delete: { isLoading: false },
  },
  auth: {
    current: {
      role: 'admin',
    },
  },
};

jest.mock('axios');

describe('SellersDataTable Component', () => {
  let mockStore;

  beforeEach(() => {
    mockStore = configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
    });
    jest.spyOn(request, 'listAll').mockImplementation(mockListAll);
    jest.spyOn(request, 'delete').mockImplementation(mockDelete);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('test_render_data_table', async () => {
    render(
      <Provider store={mockStore}>
        <SellersDataTable />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/John/i)).toBeInTheDocument();
    });
  });

  test('test_loading_indicator', async () => {
    mockStore = configureStore({
      reducer: rootReducer,
      preloadedState: {
        ...initialState,
        crud: {
          ...initialState.crud,
          listAll: {
            ...initialState.crud.listAll,
            isLoading: true,
          },
        },
      },
    });
    render(
      <Provider store={mockStore}>
        <SellersDataTable />
      </Provider>
    );

    await waitFor(() => {
      const loadingComponent = screen.getByTestId('loading-backdrop');
      expect(loadingComponent).toBeInTheDocument();
    });
  });
});
