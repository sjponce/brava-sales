import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ForgetPasswordForm from './ForgetPasswordForm';

describe('ForgetPasswordForm', () => {
  const mockRegister = jest.fn();
  const mockWatch = jest.fn();

  beforeEach(() => {
    mockRegister.mockClear();
    mockWatch.mockClear();
  });

  test('test_render_password_input_fields', () => {
    const { getAllByLabelText, getByLabelText } = render(<ForgetPasswordForm register={mockRegister} watch={mockWatch} />);
    const passwordInput = getAllByLabelText(/Contraseña/i)[0];
    const repasswordInput = getByLabelText(/Vuelve a introducir la contraseña/i);
    
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(repasswordInput).toBeInTheDocument();
    expect(repasswordInput).toHaveAttribute('type', 'password');
  });

  test('test_password_input_required', () => {
    const { getAllByLabelText } = render(<ForgetPasswordForm register={mockRegister} watch={mockWatch} />);
    const passwordInput = getAllByLabelText(/Contraseña/i)[0];
    expect(passwordInput).toBeRequired();
  });

  test('test_repassword_input_required', () => {
    const { getByLabelText } = render(<ForgetPasswordForm register={mockRegister} watch={mockWatch} />);
    const repasswordInput = getByLabelText(/Vuelve a introducir la contraseña/i);
    expect(repasswordInput).toBeRequired();
  });

  test('test_password_min_length_validation', () => {
    mockWatch.mockReturnValue('short');
    const { getByText } = render(<ForgetPasswordForm register={mockRegister} watch={mockWatch} />);
    expect(getByText(/La contraseña debe tener al menos 8 caracteres/i)).toBeInTheDocument();
  });

  test('test_password_match_validation', () => {
    mockWatch.mockImplementation((field) => {
      if (field === 'password') return 'password123';
      if (field === 'repassword') return 'password456';
    });
    const { getByText } = render(<ForgetPasswordForm register={mockRegister} watch={mockWatch} />);
    expect(getByText(/Las contraseñas no coinciden/i)).toBeInTheDocument();
  });
});
