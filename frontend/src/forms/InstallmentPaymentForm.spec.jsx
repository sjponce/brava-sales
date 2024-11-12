import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useForm } from 'react-hook-form';
import InstallmentPaymentForm from './InstallmentPaymentForm';
import uploadImageToImgbb from '@/utils/uploadImageToImgbb';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

jest.mock('react-hook-form', () => ({
  useForm: jest.fn(),
  Controller: ({ render }) => render({ field: { onChange: jest.fn(), value: '' } }),
}));

jest.mock('@/utils/uploadImageToImgbb', () => jest.fn());

const mockStore = configureStore([]);
const store = mockStore({
  auth: {
    current: {
      role: 'customer',
    },
  },
  sales: {
    createPayment: {
      result: null,
    },
  },
});

describe('InstallmentPaymentForm', () => {
  const mockSetValue = jest.fn();
  const mockWatch = jest.fn();
  const mockRegister = jest.fn();

  beforeEach(() => {
    mockSetValue.mockClear();
    mockWatch.mockClear();
    mockRegister.mockClear();
    useForm.mockReturnValue({
      control: {},
      watch: mockWatch,
      setValue: mockSetValue,
      register: mockRegister,
    });
  });

  test('test_amount_input_validation', () => {
    const { getByLabelText } = render(
      <Provider store={store}>
        <InstallmentPaymentForm
          control={{}}
          watch={mockWatch}
          setValue={mockSetValue}
          register={mockRegister}
        />
      </Provider>
    );

    const amountInput = getByLabelText('Monto');
    fireEvent.change(amountInput, { target: { value: '100.50' } });

    expect(mockRegister).toHaveBeenCalledWith(
      'amount',
      expect.objectContaining({
        required: 'Este campo es requerido',
        pattern: {
          value: /^\d+(\.\d{1,2})?$/,
          message: 'Ingrese un número válido con hasta dos decimales',
        },
        validate: expect.any(Function),
      })
    );
  });

  test('test_image_upload_functionality', async () => {
    uploadImageToImgbb.mockResolvedValue('https://example.com/image.jpg');

    const { getByTestId, getByLabelText } = render(
      <Provider store={store}>
        <InstallmentPaymentForm
          control={{}}
          watch={mockWatch}
          setValue={mockSetValue}
          register={mockRegister}
        />
      </Provider>
    );

    const fileInput = getByTestId('image-input');
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(uploadImageToImgbb).toHaveBeenCalledWith(file);
      expect(mockSetValue).toHaveBeenCalledWith('photo', 'https://example.com/image.jpg', {
        shouldValidate: true,
      });
    });

    const removeButton = getByLabelText('Eliminar imagen');
    expect(removeButton).toBeInTheDocument();
  });

  test('test_remove_image_functionality', () => {
    mockWatch.mockReturnValue('https://example.com/image.jpg');

    const { getByLabelText } = render(
      <Provider store={store}>
        <InstallmentPaymentForm
          control={{}}
          watch={mockWatch}
          setValue={mockSetValue}
          register={mockRegister}
        />
      </Provider>
    );

    const removeButton = getByLabelText('Eliminar imagen');
    fireEvent.click(removeButton);

    expect(mockSetValue).toHaveBeenCalledWith('photo', '', { shouldValidate: true });
  });
});