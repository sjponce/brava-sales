import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AddSalesOrderForm from './AddSalesOrderForm';

const mockStore = configureStore([]);

describe('AddSalesOrderForm', () => {
  let store;
  let setValue;

  beforeEach(() => {
    store = mockStore({
      crud: {
        listAll: {
          result: {
            items: {
              result: [
                {
                  _id: '1',
                  name: 'Customer One',
                  documentType: 'ID',
                  documentNumber: '12345',
                  email: 'customer1@example.com',
                  address: {
                    street: 'Street 1',
                    streetNumber: '10',
                    floor: '1',
                    apartment: 'A',
                    city: 'City1',
                    state: 'State1',
                    zipCode: '10001',
                  },
                },
                {
                  _id: '2',
                  name: 'Customer Two',
                  documentType: 'ID',
                  documentNumber: '67890',
                  email: 'customer2@example.com',
                  address: {
                    street: 'Street 2',
                    streetNumber: '20',
                    floor: '2',
                    apartment: 'B',
                    city: 'City2',
                    state: 'State2',
                    zipCode: '20002',
                  },
                },
              ],
            },
          },
        },
      },
    });

    setValue = jest.fn();
  });

  test('test_autocomplete_updates_selected_customer', () => {
    render(
      <Provider store={store}>
        <AddSalesOrderForm setValue={setValue} />
      </Provider>,
    );

    const autocomplete = screen.getByRole('combobox');
    fireEvent.change(autocomplete, { target: { value: 'Customer One' } });
    fireEvent.click(screen.getByText('Customer One'));

    expect(setValue).toHaveBeenCalledWith('customer', '1');
    expect(setValue).toHaveBeenCalledWith('shippingAddress.street', 'Street 1');
    expect(setValue).toHaveBeenCalledWith('shippingAddress.streetNumber', '10');
    expect(setValue).toHaveBeenCalledWith('shippingAddress.floor', '1');
    expect(setValue).toHaveBeenCalledWith('shippingAddress.apartment', 'A');
    expect(setValue).toHaveBeenCalledWith('shippingAddress.city', 'City1');
    expect(setValue).toHaveBeenCalledWith('shippingAddress.state', 'State1');
    expect(setValue).toHaveBeenCalledWith('shippingAddress.zipCode', '10001');
  });

  test('test_autocomplete_resets_selected_customer', () => {
    render(
      <Provider store={store}>
        <AddSalesOrderForm setValue={setValue} />
      </Provider>,
    );

    const autocomplete = screen.getByRole('combobox');
    fireEvent.change(autocomplete, { target: { value: 'Customer One' } });
    fireEvent.click(screen.getByText('Customer One'));
    fireEvent.change(autocomplete, { target: { value: '' } });

    expect(setValue).toHaveBeenCalledWith('customer', '');
    expect(setValue).toHaveBeenCalledWith('shippingAddress.street', '');
    expect(setValue).toHaveBeenCalledWith('shippingAddress.streetNumber', '');
    expect(setValue).toHaveBeenCalledWith('shippingAddress.floor', '');
    expect(setValue).toHaveBeenCalledWith('shippingAddress.apartment', '');
    expect(setValue).toHaveBeenCalledWith('shippingAddress.city', '');
    expect(setValue).toHaveBeenCalledWith('shippingAddress.state', '');
    expect(setValue).toHaveBeenCalledWith('shippingAddress.zipCode', '');
  });

  test('test_autocomplete_displays_customer_details', () => {
    render(
      <Provider store={store}>
        <AddSalesOrderForm setValue={setValue} />
      </Provider>,
    );

    const autocomplete = screen.getByRole('combobox');
    fireEvent.change(autocomplete, { target: { value: 'Customer One' } });
    fireEvent.click(screen.getByText('Customer One'));

    expect(screen.getByText('Documento: ID 12345')).toBeInTheDocument();
    expect(screen.getByText('email: customer1@example.com')).toBeInTheDocument();
    expect(screen.getByText('Address: 10001 Street 1 10')).toBeInTheDocument();
  });
});
