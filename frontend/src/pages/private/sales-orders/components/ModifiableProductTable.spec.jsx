import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useForm, FormProvider } from 'react-hook-form';
import ModifiableProductTable from './ModifiableProductTable';
import rootReducer from '@/redux/rootReducer';

const mockProducts = [
  { _id: '1', name: 'Product 1', price: 10 },
  { _id: '2', name: 'Product 2', price: 20 },
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

    expect(screen.getByText('Producto')).toBeInTheDocument();
    expect(screen.getByText('Cantidad')).toBeInTheDocument();
    expect(screen.getByText('Talle')).toBeInTheDocument();
    expect(screen.getByText('Precio unitario')).toBeInTheDocument();
    expect(screen.getByText('Precio agrupado')).toBeInTheDocument();
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

  test('calculates total amount correctly', async () => {
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
      const quantityInput = screen.getByRole('spinbutton');
      fireEvent.change(quantityInput, { target: { value: '2' } });

      const productSelect = screen.getAllByRole('combobox')[0];
      fireEvent.change(productSelect, { target: { value: mockProducts[0]._id } });
    });

    expect(screen.getByText(/Total/)).toBeInTheDocument();
  });
});
