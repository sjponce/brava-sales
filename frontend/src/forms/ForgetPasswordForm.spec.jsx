import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ForgetPasswordForm from './ForgetPasswordForm';

describe('ForgetPasswordForm', () => {
  const mockRegister = jest.fn();

  beforeEach(() => {
    mockRegister.mockClear();
  });

  test('test_render_email_input_field', () => {
    const { getByRole } = render(<ForgetPasswordForm register={mockRegister} />);
    const emailInput = getByRole('textbox', { name: 'Correo electrónico' });
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('test_email_input_required', () => {
    const { getByRole } = render(<ForgetPasswordForm register={mockRegister} />);
    const emailInput = getByRole('textbox', { name: 'Correo electrónico' });
    expect(emailInput).toBeRequired();
  });
});
