import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import ModalInstallmentDetails from './ModalInstallmentDetails';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '@/redux/rootReducer';
import { BrowserRouter as Router } from 'react-router-dom';

describe('ModalInstallmentDetails Component', () => {
  let mockStore;

  const mockInstallmentId = 1;
  const mockInstallment = {
    _id: mockInstallmentId,
    amount: 1000,
    payments: [{ amount: 500 }, { amount: 300 }],
  };

  beforeEach(() => {
    mockStore = configureStore({
      reducer: rootReducer,
      preloadedState: {
        sales: {
          current: {
            result: {
              _id: mockInstallmentId,
              installments: [{ ...mockInstallment }],
            },
          },
          createPayment: {
            isLoading: false,
            result: { installments: [{ ...mockInstallment }] },
          },
          createMPLink: {
            isLoading: false,
            result: null,
          },
        },
      },
    });
  });

  test('test_render_modal_installment_details', async () => {
    render(
      <Provider store={mockStore}>
        <Router>
          <ModalInstallmentDetails
            open={true}
            handleClose={() => {}}
            installmentId={mockInstallmentId}
            />
        </Router>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Registrar pago/i)).toBeInTheDocument();
    });
  });

  test('test_payment_calculation', async () => {
    render(
      <Provider store={mockStore}>
        <Router>
          <ModalInstallmentDetails
            open={true}
            handleClose={() => {}}
            installmentId={mockInstallmentId}
            />
        </Router>
      </Provider>
    );
    const payedAmount = mockInstallment.payments.reduce((sum, payment) => sum + payment.amount, 0);
    const paymentDifference = mockInstallment.amount - payedAmount;

    await waitFor(() => {
      expect(screen.getByText(new RegExp(paymentDifference.toString()))).toBeInTheDocument();
    });
  });

  test('test_close_modal', async () => {
    const mockHandleClose = jest.fn();
    render(
      <Provider store={mockStore}>
        <Router>
          <ModalInstallmentDetails
            open={true}
            handlerOpen={mockHandleClose}
            installment={mockInstallment}
            />
        </Router>
      </Provider>
    );

    const closeButton = screen.getByTestId('CloseIcon');

    fireEvent.click(closeButton);
    waitFor(() => {
      expect(mockHandleClose).toHaveBeenCalled();
    });
  });
});
