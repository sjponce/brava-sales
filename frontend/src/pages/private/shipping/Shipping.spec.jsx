import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import Shipping from './Shipping';
import store from '@/redux/store';

describe('Shipping Component', () => {
  let mockStore;

  beforeEach(() => {
    mockStore = store;
  });

  test('test_render_shipping_component', () => {
    render(
      <Provider store={mockStore}>
        <Shipping />
      </Provider>
    );

    expect(screen.getByText('Entregas')).toBeInTheDocument();
  });

  test('test_shipping_title_typography', () => {
    render(
      <Provider store={mockStore}>
        <Shipping />
      </Provider>
    );

    const titleElement = screen.getByText('Entregas');
  });
});
