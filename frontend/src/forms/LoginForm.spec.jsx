import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  const mockRegister = jest.fn();
  beforeEach(() => {
    mockRegister.mockClear();
  });

  test('test_render_email_input_field', () => {
    const { getByRole } = render(<LoginForm register={mockRegister} />);
    const emailInput = getByRole('textbox', { name: 'Correo electrónico' });
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('test_email_input_required', () => {
    const { getByRole } = render(<LoginForm register={mockRegister} />);
    const emailInput = getByRole('textbox', { name: 'Correo electrónico' });
    expect(emailInput).toBeRequired();
  });

  test('test_render_password_input_field', () => {
    const { getByTestId } = render(<LoginForm register={mockRegister} />);
    const passwordInput = getByTestId('password').querySelector('input');
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
