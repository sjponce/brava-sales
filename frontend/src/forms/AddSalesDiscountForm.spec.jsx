import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useSelector, useDispatch } from 'react-redux';
import AddSalesDiscountForm from './AddSalesDiscountForm';
import { getPaymentOptions } from '@/redux/sales/selectors';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

describe('AddSalesDiscountForm', () => {
  const mockSetValue = jest.fn();
  const mockWatch = jest.fn();
  const mockDispatch = jest.fn();
  const mockPromotions = {
    result: {
      items: [
        { _id: '1', name: 'Promo 1', percent: 10 },
        { _id: '2', name: 'Promo 2', percent: 20 },
      ],
    },
  };
  const mockCurrentOptions = { discountType: 'promotion' };

  beforeEach(() => {
    mockSetValue.mockClear();
    mockWatch.mockClear();
    mockDispatch.mockClear();
    useSelector.mockImplementation((selector) => {
      if (selector === getPaymentOptions) return mockCurrentOptions;
      return mockPromotions;
    });
    useDispatch.mockReturnValue(mockDispatch);
  });

  test('test_promotions_autocomplete_display', () => {
    mockWatch.mockReturnValue(null);

    const { getByRole, getByText } = render(
      <AddSalesDiscountForm setValue={mockSetValue} watch={mockWatch} control={{}} />
    );

    const autocomplete = getByRole('combobox');
    fireEvent.change(autocomplete, { target: { value: 'Promo' } });

    expect(getByText('Promo 1 (10%)')).toBeInTheDocument();
    expect(getByText('Promo 2 (20%)')).toBeInTheDocument();
  });

  test('test_promotion_selection_updates_form_values', () => {
    const selectedPromotion = mockPromotions.result.items[0];
    mockWatch.mockImplementation((field) => {
      if (field === 'promotion') return selectedPromotion;
      if (field === 'totalAmount') return 100;
      return null;
    });
  
    const { getByRole } = render(
      <AddSalesDiscountForm
        setValue={mockSetValue}
        watch={mockWatch}
        control={{}}
      />,
    );
  
    const autocomplete = getByRole('combobox');
    fireEvent.change(autocomplete, { target: { value: 'Promo 1' } });
    fireEvent.keyDown(autocomplete, { key: 'Enter', code: 'Enter' });
  
    // Ensure the totalWithDiscount is set
    expect(mockSetValue).toHaveBeenCalledWith('totalWithDiscount', 100);
  
    // Check if there are any unexpected calls
    expect(mockSetValue).toHaveBeenCalledTimes(1);
  });
  
  
});
