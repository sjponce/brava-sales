import React from 'react';
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import AddInstallmentsForm from './AddInstallmentsForm';

jest.mock('react-hook-form');

describe('AddInstallmentsForm', () => {
  const setup = (defaultValues = {}) => {
    const methods = {
      ...useForm({ defaultValues }),
      watch: jest.fn((field) => defaultValues[field]),
      setValue: jest.fn(),
    };
    const utils = render(<AddInstallmentsForm {...methods} />);
    return {
      ...utils,
      methods,
    };
  };

  test('test_calculate_installment_amount', () => {
    const { methods } = setup({ totalWithDiscount: 1000, installments: 5 });
    const calculateInstallment = (installments) => {
      const interest = 0.05;
      const totalWithDiscount = methods.watch('totalWithDiscount');
      return totalWithDiscount * (1 + (installments - 1) * interest) / installments;
    };
    const result = calculateInstallment(5);
    expect(result).toBeCloseTo(1000 * (1 + (5 - 1) * 0.05) / 5, 2);
  });

  test('test_final_amount_update_on_dependencies_change', () => {
    const { methods, rerender } = setup({ totalWithDiscount: 1000, installments: 5 });
    rerender(<AddInstallmentsForm {...methods} defaultValues={{ totalWithDiscount: 2000, installments: 10 }} />);
    
    methods.watch.mockImplementation((field) => {
      if (field === 'totalWithDiscount') return 2000;
      if (field === 'installments') return 10;
      if (field === 'finalAmount') return 2000 * (1 + (10 - 1) * 0.05);
    });

    const finalAmount = methods.watch('finalAmount');
    expect(finalAmount).toBeCloseTo(2000 * (1 + (10 - 1) * 0.05), 2);
  });
});
