import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import SalesOrders from './SalesOrder';

const mockStore = configureStore([]);

describe('SalesOrders Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        current: {
          role: 'user',
        },
      },
    });
  });

  test('test_button_disabled_for_non_admin', () => {
    render(
      <Provider store={store}>
        <SalesOrders />
      </Provider>
    );

    const button = screen.getByText('Nueva Orden de Venta').closest('button');
    expect(button).toBeDisabled();
  });

  test('test_modal_opens_on_button_click', () => {
    store = mockStore({
      auth: {
        current: {
          role: 'admin',
        },
      },
    });

    render(
      <Provider store={store}>
        <SalesOrders />
      </Provider>
    );

    const button = screen.getByText('Nueva Orden de Venta').closest('button');
    fireEvent.click(button);

    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
  });

  test('test_modal_closes_on_handle_close', () => {
    store = mockStore({
      auth: {
        current: {
          role: 'admin',
        },
      },
    });

    render(
      <Provider store={store}>
        <SalesOrders />
      </Provider>
    );

    const button = screen.getByText('Nueva Orden de Venta').closest('button');
    fireEvent.click(button);

    const closeButton = screen.getByText('Close'); // Assuming there's a close button with text 'Close'
    fireEvent.click(closeButton);

    const modal = screen.queryByRole('dialog');
    expect(modal).not.toBeInTheDocument();
  });
});