import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import SalesOrderDataTable from './SalesOrderDataTable';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '@/redux/rootReducer';
import { request } from '@/request';

const mockDelete = jest.fn().mockResolvedValue({
  message: 'Se elimino el elemento',
  success: true,
});

const mockListAll = jest.fn().mockResolvedValue({
  message: 'Se encontro todos los elementos',
  result: {
    items: {
      result: [
        {
          _id: '1',
          salesOrderCode: 'SO001',
          customer: { name: 'John Doe' },
          orderDate: '2023-05-01T00:00:00.000Z',
          status: 'pending',
        },
        {
          _id: '2',
          salesOrderCode: 'SO002',
          customer: { name: 'Jane Smith' },
          orderDate: '2023-05-02T00:00:00.000Z',
          status: 'completed',
        },
      ],
    },
  },
  success: true,
});

const initialState = {
  sales: {
    listAll: {
      result: {
        items: {
          result: [
            {
              _id: '1',
              salesOrderCode: 'SO001',
              customer: { name: 'John Doe' },
              orderDate: '2023-05-01T00:00:00.000Z',
              status: 'pending',
            },
          ],
        },
      },
      isLoading: false,
      isSuccess: true,
    },
    createPayment: {
      result: {
        _id: '1',
      },
      isLoading: false,
      isSuccess: true,
    },
    read: { isLoading: false },
    create: { isLoading: false },
    update: { isLoading: false },
    delete: { isLoading: false },
  },
};

jest.mock('axios');

describe('SalesOrderDataTable Component', () => {
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
        <SalesOrderDataTable />
      </Provider>
    );
    await waitFor(() => {
      const { sales } = mockStore.getState();
      const { listAll } = sales;
      return listAll.isSuccess && !listAll.isLoading;
    });

    setTimeout(() => {
      expect(screen.getByText(/SO001/i)).toBeInTheDocument();
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    }, 0);
  });

  test('test_loading_indicator', async () => {
    mockStore = configureStore({
      reducer: rootReducer,
      preloadedState: {
        ...initialState,
        sales: {
          ...initialState.sales,
          listAll: {
            ...initialState.sales.listAll,
            isLoading: true,
          },
        },
      },
    });
    render(
      <Provider store={mockStore}>
        <SalesOrderDataTable />
      </Provider>
    );
    await waitFor(() => {
      const { sales } = mockStore.getState();
      const { listAll } = sales;
      return listAll.isLoading;
    });
    setTimeout(() => {
      const loadingComponent = screen.getByRole('progressbar');
      expect(loadingComponent).toBeInTheDocument();
    }, 0);
  });
});
