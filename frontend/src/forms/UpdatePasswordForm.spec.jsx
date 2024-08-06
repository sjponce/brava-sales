import { render, screen, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import UpdatePasswordForm from './UpdatePasswordForm';

describe('UpdatePasswordForm', () => {
  const Wrapper = () => {
    const { register, watch } = useForm();
    return <UpdatePasswordForm register={register} watch={watch} />;
  };

  test('test_render_password_fields', () => {
    render(<Wrapper />);
    expect(screen.getByLabelText(/Nueva contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirmar Contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nueva contraseña/i)).toHaveAttribute('type', 'password');
    expect(screen.getByLabelText(/Confirmar Contraseña/i)).toHaveAttribute('type', 'password');
  });

  test('test_password_mismatch_error', () => {
    render(<Wrapper />);
    const passwordField = screen.getByLabelText(/Nueva contraseña/i);
    const confirmPasswordField = screen.getByLabelText(/Confirmar Contraseña/i);

    passwordField.value = 'password123';
    confirmPasswordField.value = 'password321';

    waitFor(() => {
      expect(screen.getByText(/Las contraseñas no coinciden/i)).toBeInTheDocument();
    });
  });

  test('test_minimum_password_length', () => {
    render(<Wrapper />);
    const passwordField = screen.getByLabelText(/Nueva contraseña/i);
    expect(passwordField).toHaveAttribute('minLength', '8');
  });
});
