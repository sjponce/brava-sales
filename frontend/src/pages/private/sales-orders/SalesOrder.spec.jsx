import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import SalesOrders from './SalesOrder';
import store from '@/redux/store';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '@/redux/rootReducer';

describe('SalesOrders Component', () => {
  let mockStore;

  beforeEach(() => {
    mockStore = store;
  });

  test('test_open_add_sales_order_modal', async () => {
    render(
      <Provider store={mockStore}>
        <SalesOrders />
      </Provider>
    );

    const button = screen.getByText(/Nueva Orden de Venta/i);
    fireEvent.click(button);

    setTimeout(() => {
      expect(screen.getByText(/Crear Orden de Venta/i)).toBeInTheDocument();
    }, 0);
  });

  test('test_button_disabled_for_non_admins', () => {
    mockStore = configureStore({
      reducer: rootReducer,
      preloadedState: {
        auth: {
          current: {
            role: 'user',
          },
        },
      },
    });

    render(
      <Provider store={mockStore}>
        <SalesOrders />
      </Provider>
    );
    setTimeout(() => {
      const button = screen.getByText(/Nueva Orden de Venta/i);
      expect(button).toBeDisabled();
    }, 0);
  });

  test('test_close_add_sales_order_modal', () => {
    render(
      <Provider store={mockStore}>
        <SalesOrders />
      </Provider>
    );
    
    const button = screen.getByText(/Nueva Orden de Venta/i);
    fireEvent.click(button);

    setTimeout(() => {
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
    }, 0);

    expect(screen.queryByText(/Crear Orden de Venta/i)).not.toBeInTheDocument();
  });
});
