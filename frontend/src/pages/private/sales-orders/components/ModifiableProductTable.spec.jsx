import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useForm, FormProvider } from 'react-hook-form';
import ModifiableProductTable from './ModifiableProductTable';
import rootReducer from '@/redux/rootReducer';

const mockProducts = [
      { product: 'Product 1', price: 10, sizes: [{ size: 'S', quantity: 2 }, { size: 'M', quantity: 3 }] },
      { product: 'Product 2', price: 20, sizes: [{ size: 'S', quantity: 1 }, { size: 'L', quantity: 4 }] },
    ];

const initialState = {
  stock: {
    listAll: {
      result: {
        items: {
          result: mockProducts,
        },
      },
    },
  },
};

const TestWrapper = ({ children }) => {
  const methods = useForm({
    defaultValues: {
      products: [],
    },
  });
  return <FormProvider {...methods}>{React.cloneElement(children, { ...methods })}</FormProvider>;
};

describe('ModifiableProductTable Component', () => {
  let mockStore;

  beforeEach(() => {
    mockStore = configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
    });
  });

  test('renders the table with initial empty state', () => {
    render(
      <Provider store={mockStore}>
        <TestWrapper>
          <ModifiableProductTable />
        </TestWrapper>
      </Provider>
    );

    expect(screen.getByText('Detalles de orden')).toBeInTheDocument();
    expect(screen.getByText('Unitario')).toBeInTheDocument();
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('Agregar')).toBeInTheDocument();
  });

  test('adds a new row when "Agregar" button is clicked', async () => {
    render(
      <Provider store={mockStore}>
        <TestWrapper>
          <ModifiableProductTable />
        </TestWrapper>
      </Provider>
    );

    const addButton = screen.getByText('Agregar');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByTestId('DeleteIcon')).toBeInTheDocument();
    });
  });

  test('removes a row when delete button is clicked', async () => {
    render(
      <Provider store={mockStore}>
        <TestWrapper>
          <ModifiableProductTable />
        </TestWrapper>
      </Provider>
    );

    const addButton = screen.getByText('Agregar');
    fireEvent.click(addButton);

    await waitFor(() => {
      const deleteButton = screen.getByTestId('DeleteIcon');
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(screen.queryAllByRole('textbox').length).toBe(0);
    });
  });
});
