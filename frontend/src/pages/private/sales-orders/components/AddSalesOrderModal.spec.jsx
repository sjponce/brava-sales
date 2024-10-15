import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import AddSalesOrderModal from './AddSalesOrderModal';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '@/redux/rootReducer';

describe('AddSalesOrderModal Component', () => {
  let mockStore;

  const mockCustomers = {
    items: {
      result: [
        { id: 1, name: 'Customer 1' },
        { id: 2, name: 'Customer 2' },
      ],
    },
  };

  beforeEach(() => {
    mockStore = configureStore({
      reducer: rootReducer,
      preloadedState: {
        crud: {
          listAll: {
            result: mockCustomers,
          },
          read: {
            result: { id: 1, name: 'Customer 1' },
          },
        },
      },
    });
  });

  test('test_open_add_sales_order_modal', async () => {
    render(
      <Provider store={mockStore}>
        <AddSalesOrderModal open={true} handlerOpen={() => {}} />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Crear orden de venta/i)[0]).toBeInTheDocument();
    });
  });

  test('test_close_add_sales_order_modal', async () => {
    const mockHandlerOpen = jest.fn();
    render(
      <Provider store={mockStore}>
        <AddSalesOrderModal open={true} handlerOpen={mockHandlerOpen} />
      </Provider>
    );

    const closeButton = screen.getByTestId('CloseIcon');
    fireEvent.click(closeButton);

    expect(mockHandlerOpen).toHaveBeenCalledWith(false);
  });
});
