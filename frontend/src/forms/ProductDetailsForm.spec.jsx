import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductDetailsForm from './ProductDetailsForm';
import uploadImageToImgbb from '@/utils/uploadImageToImgbb';

jest.mock('@/utils/uploadImageToImgbb');

describe('ProductDetailsForm', () => {
  const mockWatch = jest.fn();
  const mockSetValue = jest.fn();

  beforeEach(() => {
    mockWatch.mockClear();
    mockSetValue.mockClear();
  });

  test('test_image_upload_functionality', async () => {
    const imageUrl = 'http://example.com/image.jpg';
    uploadImageToImgbb.mockResolvedValue(imageUrl);
    mockWatch.mockReturnValue('');

    const { getByTestId } = render(
      <ProductDetailsForm watch={mockWatch} />,
    );

    const fileInput = getByTestId('raised-button-file');
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(uploadImageToImgbb).toHaveBeenCalledWith(file);
      expect(mockSetValue).toHaveBeenCalledWith('photo', imageUrl);
    });
  });

  test('test_phone_input_filtering', () => {
    const { getByLabelText } = render(
      <ProductDetailsForm watch={mockWatch} />,
    );

    const phoneInput = getByLabelText('Teléfono');
    fireEvent.change(phoneInput, { target: { value: '123-abc-456' } });

    expect(mockSetValue).toHaveBeenCalledWith('phone', '123456');
  });

  test('test_no_stock_message_display', () => {
    mockWatch.mockReturnValueOnce([]).mockReturnValueOnce(0);

    const { getByText } = render(
      <ProductDetailsForm watch={mockWatch} />,
    );

    expect(getByText('Sin Stock registrado')).toBeInTheDocument();
  });
});
