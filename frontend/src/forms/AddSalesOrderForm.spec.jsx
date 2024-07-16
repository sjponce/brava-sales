import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddSalesOrderForm from './AddSalesOrderForm';
import uploadImageToImgbb from '@/utils/uploadImageToImgbb';

jest.mock('@/utils/uploadImageToImgbb');

describe('AddSalesOrderForm', () => {
  const mockRegister = jest.fn();
  const mockSetValue = jest.fn();
  const mockWatch = jest.fn();

  beforeEach(() => {
    mockRegister.mockClear();
    mockSetValue.mockClear();
    mockWatch.mockClear();
  });

  test('test_image_upload_functionality', async () => {
    const imageUrl = 'http://example.com/image.jpg';
    uploadImageToImgbb.mockResolvedValue(imageUrl);
    mockWatch.mockReturnValue('');

    const { getByTestId } = render(
      <AddSalesOrderForm
        register={mockRegister}
        setValue={mockSetValue}
        watch={mockWatch}
        roleOptions={[]}
      />,
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
      <AddSalesOrderForm
        register={mockRegister}
        setValue={mockSetValue}
        watch={mockWatch}
        roleOptions={[]}
      />,
    );

    const phoneInput = getByLabelText('Teléfono');
    fireEvent.change(phoneInput, { target: { value: '123-abc-456' } });

    expect(mockSetValue).toHaveBeenCalledWith('phone', '123456');
  });
});
