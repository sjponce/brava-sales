import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSelector } from 'react-redux';
import AddSalesOrderForm from './AddSalesOrderForm';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('AddSalesOrderForm', () => {
  const mockSetValue = jest.fn();
  const mockWatch = jest.fn();
  const mockCustomers = {
    result: {
      items: {
        result: [
          { _id: '1', name: 'Customer 1', documentType: 'DNI', documentNumber: '12345678', email: 'customer1@example.com', address: { zipCode: '1000', street: 'Main St', streetNumber: '123' } },
          { _id: '2', name: 'Customer 2', documentType: 'RUC', documentNumber: '87654321', email: 'customer2@example.com', address: { zipCode: '2000', street: 'Second St', streetNumber: '456' } },
        ],
      },
    },
  };

  beforeEach(() => {
    mockSetValue.mockClear();
    mockWatch.mockClear();
    useSelector.mockImplementation(() => mockCustomers);
  });

  test('test_customer_autocomplete_functionality', async () => {
    mockWatch.mockReturnValue(null);
  
    const { getByRole, getByText } = render(
      <AddSalesOrderForm
        setValue={mockSetValue}
        watch={mockWatch}
      />,
    );
  
    const autocomplete = getByRole('combobox');
    fireEvent.change(autocomplete, { target: { value: 'Customer' } });
    fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
    fireEvent.keyDown(autocomplete, { key: 'Enter' });
  
    await waitFor(() => {
      expect(mockSetValue).toHaveBeenCalledWith('customer', expect.objectContaining({ name: 'Customer 1' }));
    });
  });  

  test('test_customer_details_display', () => {
    const selectedCustomer = mockCustomers.result.items.result[0];
    mockWatch.mockReturnValue(selectedCustomer);

    const { getByText } = render(
      <AddSalesOrderForm
        setValue={mockSetValue}
        watch={mockWatch}
      />,
    );

    expect(getByText(`Documento: ${selectedCustomer.documentType} ${selectedCustomer.documentNumber}`)).toBeInTheDocument();
    expect(getByText(`email: ${selectedCustomer.email}`)).toBeInTheDocument();
    expect(getByText(`Address: ${selectedCustomer.address.zipCode} ${selectedCustomer.address.street} ${selectedCustomer.address.streetNumber}`)).toBeInTheDocument();
  });
});
