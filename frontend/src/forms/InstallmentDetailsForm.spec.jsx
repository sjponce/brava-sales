import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import InstallmentDetailsForm from './InstallmentDetailsForm';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '@/redux/rootReducer';
import { BrowserRouter as Router } from 'react-router-dom';

describe('InstallmentDetailsForm Component', () => {
  let mockStore;

  const mockInstallmentId = '1';
  const mockInstallment = {
    _id: mockInstallmentId,
    installmentNumber: 1,
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
              installments: [{ ...mockInstallment }],
            },
          },
          createPayment: {
            isLoading: false,
          },
          createMPLink: {
            result: null,
          },
        },
        auth: {
          current: {
            role: 'admin',
          },
        },
      },
    });
  });

  test('test_render_installment_details_form', async () => {
    render(
      <Provider store={mockStore}>
        <Router>
          <InstallmentDetailsForm
            open={true}
            handlerOpen={() => {}}
            installmentId={mockInstallmentId}
          />
        </Router>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Detalle de cuota 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Añadir pago/i)).toBeInTheDocument();
    });
  });

  test('test_payment_calculation', async () => {
    render(
      <Provider store={mockStore}>
        <Router>
          <InstallmentDetailsForm
            open={true}
            handlerOpen={() => {}}
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

  test('test_close_form', async () => {
    const mockHandlerOpen = jest.fn();
    render(
      <Provider store={mockStore}>
        <Router>
          <InstallmentDetailsForm
            open={true}
            handlerOpen={mockHandlerOpen}
            installmentId={mockInstallmentId}
          />
        </Router>
      </Provider>
    );

    const closeButton = screen.getByText(/Volver/i);

    fireEvent.click(closeButton);
    await waitFor(() => {
      expect(mockHandlerOpen).toHaveBeenCalledWith(false);
    });
  });
});
