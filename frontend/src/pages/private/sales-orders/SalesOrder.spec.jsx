import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SalesOrders from './SalesOrder';

// Mock the child components
jest.mock('./components/SalesOrderDataTable', () => () => <div data-test-id="sales-order-data-table" />);
jest.mock('./components/AddSalesOrderModal', () => ({ open, handlerOpen }) => (
  <div data-testid="add-sales-order-modal">
    {open ? 'Modal Open' : 'Modal Closed'}
    <button onClick={() => handlerOpen(false)}>Close Modal</button>
  </div>
));

describe('SalesOrders', () => {
  test('renders SalesOrders component', () => {
    render(<SalesOrders />);
    expect(screen.getByText('Ordenes de venta')).toBeInTheDocument();
    expect(screen.getByText('Nueva Orden de Venta')).toBeInTheDocument();
    expect(screen.getByTestId('sales-order-data-table')).toBeInTheDocument();
  });

  test('opens AddSalesOrderModal when "Nueva Orden de Venta" button is clicked', () => {
    render(<SalesOrders />);
    const addButton = screen.getByText('Nueva Orden de Venta');
    fireEvent.click(addButton);
    expect(screen.getByText('Modal Open')).toBeInTheDocument();
  });

  test('closes AddSalesOrderModal when close button is clicked', () => {
    render(<SalesOrders />);
    const addButton = screen.getByText('Nueva Orden de Venta');
    fireEvent.click(addButton);
    const closeButton = screen.getByText('Close Modal');
    fireEvent.click(closeButton);
    expect(screen.getByText('Modal Closed')).toBeInTheDocument();
  });

  test('AddButton has correct data-test-id', () => {
    render(<SalesOrders />);
    const addButton = screen.getByTestId('AddButton');
    expect(addButton).toBeInTheDocument();
  });
});
