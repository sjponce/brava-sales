import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import Sellers from './Sellers';
import store from '@/redux/store';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '@/redux/rootReducer';

describe('Sellers Component', () => {
  let mockStore;

  beforeEach(() => {
    mockStore = store;
  });

  test('test_open_add_seller_modal', async () => {
    render(
      <Provider store={mockStore}>
        <Sellers />
      </Provider>
    );

    const button = screen.getByText(/Nuevo vendedor/i);
    fireEvent.click(button);

    setTimeout(() => {
      expect(screen.getByText(/Crear vendendor/i)).toBeInTheDocument();
    }, 0);
  });

  test('test_button_disabled_for_non_admins', () => {
    mockStore = configureStore(
      {
        reducer: rootReducer,
        preloadedState: {
          auth: {
            current: {
              role: 'seller',
            },
          },
        },
      },
    );

    render(
      <Provider store={mockStore}>
        <Sellers />
      </Provider>
    );
    setTimeout(() => {
      const button = screen.getByText(/Nuevo vendedor/i);
      expect(button).toBeDisabled();
    }, 0);
  });

  test('test_close_add_seller_modal', () => {
    render(
      <Provider store={mockStore}>
        <Sellers />
      </Provider>
    );
    
    const button = screen.getByText(/Nuevo vendedor/i);
    fireEvent.click(button);

    setTimeout(() => {
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
    }, 0);

    expect(screen.queryByText(/Crear vendendor/i)).not.toBeInTheDocument();
  });
});