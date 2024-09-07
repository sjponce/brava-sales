import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ModalSalesOrderDetails from './ModalSalesOrderDetails';
import { selectCurrentItem } from '@/redux/sales/selectors';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('@/redux/sales/selectors', () => ({
  selectCurrentItem: jest.fn(),
}));

const mockStore = configureStore([]);

describe('ModalSalesOrderDetails', () => {
  let store;
  let handlerOpen;

  beforeEach(() => {
    store = mockStore({
      sales: {
        currentItem: {
          result: {
            createdAt: '2023-10-01T00:00:00Z',
            status: 'completed',
            salesOrderCode: 'SO12345',
            customer: { name: 'John Doe' },
            totalAmount: 100,
            discount: 10,
            finalAmount: 90,
            installments: [{ installmentNumber: 1, status: 'paid', dueDate: '2023-11-01', paymentDate: '2023-10-15', id: 1 }],
            products: [{ product: { stockId: 'P123' }, color: 'Red', sizes: [{ id: 1, size: 'M', quantity: 2 }] }],
          },
        },
        createPayment: {
          result: {
            _id: 1,
          },
        },
        createMPLink: {
          result: null,
        },
      },
    });

    handlerOpen = jest.fn();
    selectCurrentItem.mockReturnValue(store.getState().sales.currentItem);
  });

  test('test_modal_closes_on_close_button_click', () => {
    render(
      <Provider store={store}>
        <Router>
          <ModalSalesOrderDetails open={true} handlerOpen={handlerOpen} />
        </Router>
      </Provider>
    );

    fireEvent.click(screen.getByTestId('DeleteIcon'));
    expect(handlerOpen).toHaveBeenCalledWith(false);
  });

  test('test_modal_displays_correct_sales_order_details', () => {
    render(
      <Provider store={store}>
        <Router>
          <ModalSalesOrderDetails open={true} handlerOpen={handlerOpen} />
        </Router>
      </Provider>
    );

    waitFor(() => {
      expect(screen.getByText(/Resumen de orden de venta/i)).toBeInTheDocument();
      expect(screen.getByText(/Creación/i)).toBeInTheDocument();
      expect(screen.getByText('01/10/2023')).toBeInTheDocument();
      expect(screen.getByText(/Estado/i)).toBeInTheDocument();
      expect(screen.getByText(/completed/i)).toBeInTheDocument();
      expect(screen.getByText(/Código/i)).toBeInTheDocument();
      expect(screen.getByText(/SO12345/i)).toBeInTheDocument();
      expect(screen.getByText(/Cliente/i)).toBeInTheDocument();
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/Monto Base/i)).toBeInTheDocument();
      expect(screen.getByText(/\$100/i)).toBeInTheDocument();
      expect(screen.getByText(/Descuento/i)).toBeInTheDocument();
      expect(screen.getByText(/%10/i)).toBeInTheDocument();
      expect(screen.getByText(/Monto final/i)).toBeInTheDocument();
      expect(screen.getByText(/\$90/i)).toBeInTheDocument();
    });
  });
});