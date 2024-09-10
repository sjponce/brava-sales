import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import DataTableCustomers from './DataTableCustomers';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '@/redux/rootReducer';
import { request } from '@/request';

const mockDelete = jest.fn().mockResolvedValue({
  message: 'Se elimino el elemento',
  success: true,
});

const mockListAll = jest.fn().mockResolvedValue({
  message: 'Se encontro todos los elementos',
  result: [
    {
      _id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      number: '123456789',
      documentType: 'DNI',
      documentNumber: '12345678',
      ivaCondition: 'Responsable Inscripto',
      address: {
        street: 'Salta',
        streetNumber: '123',
        city: 'Cordoba',
        state: 'Cordoba',
      },
      enabled: true,
    },
    {
      _id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      number: '987654321',
      documentType: 'Passport',
      documentNumber: '87654321',
      ivaCondition: 'Consumidor Final',
      address: {
        street: 'Second St',
        streetNumber: '456',
        city: 'Cordoba',
        state: 'Cordoba',
      },
      enabled: false,
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
              name: 'John Doe',
              email: 'john@example.com',
              number: '123456789',
              documentType: 'DNI',
              documentNumber: '12345678',
              ivaCondition: 'Responsable Inscripto',
              address: {
                street: 'Main St',
                streetNumber: '123',
                city: 'Buenos Aires',
                state: 'Buenos Aires',
              },
              enabled: true,
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

describe('DataTableCustomers Component', () => {
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
        <DataTableCustomers />
      </Provider>
    );
    await waitFor(() => {
      const { crud } = mockStore.getState();
      const { listAll } = crud;
      return listAll.isSuccess && !listAll.isLoading;
    });

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
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
            isLoading: false,
          },
        },
      },
    });
    render(
      <Provider store={mockStore}>
        <DataTableCustomers />
      </Provider>
    );
    await waitFor(() => {
      const { crud } = mockStore.getState();
      const { listAll } = crud;
      return listAll.isLoading;
    });

    const loadingComponent = screen.getByTestId('loading-backdrop');
    expect(loadingComponent).toBeInTheDocument();
  });
});
