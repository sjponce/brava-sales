import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import SalesOrders from './SalesOrder';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '@/redux/rootReducer';

describe('SalesOrders Component', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        crud: {
          listAll: {
            result: {
              items: [],
            },
          },
        },
      },
    });
  });

  test('test_open_add_sales_order_modal', async () => {
    render(
      <Provider store={store}>
        <SalesOrders />
      </Provider>
    );

    const button = screen.getByText(/Nueva Orden de Venta/i);
    fireEvent.click(button);

    setTimeout(() => {
      expect(screen.getByText(/Crear Orden de Venta/i)).toBeInTheDocument();
    }, 1000);
  });

  test('test_close_add_sales_order_modal', async () => {
    render(
      <Provider store={store}>
        <SalesOrders />
      </Provider>
    );

    const button = screen.getByText(/Nueva Orden de Venta/i);
    fireEvent.click(button);

    const closeButton = screen.getByTestId("CloseIcon");
    fireEvent.click(closeButton);

    setTimeout(() => {
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
    }, 0);
  });
});
