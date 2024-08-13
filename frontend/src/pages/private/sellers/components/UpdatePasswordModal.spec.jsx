import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import UpdatePasswordModal from './UpdatePasswordModal';
import { updatePassword } from '@/redux/auth/actions';

const mockStore = configureStore([]);

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useForm: () => jest.requireActual('react-hook-form').useForm({
    defaultValues: {
      password: 'newPassword123',
      confirmPassword: 'newPassword123',
    },
  }),
}));

jest.mock('@/redux/auth/actions', () => ({
  updatePassword: jest.fn(),
}));

describe('UpdatePasswordModal', () => {
  let store;
  const mockHandlerOpen = jest.fn();

  beforeEach(() => {
    store = mockStore({
      auth: {
        updatePassword: { isLoading: false },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('test_render_update_password_modal', () => {
    render(
      <Provider store={store}>
        <UpdatePasswordModal idUser="123" open handlerOpen={mockHandlerOpen} />
      </Provider>,
    );

    expect(screen.getByText(/Actualizar contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nueva contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirmar Contraseña/i)).toBeInTheDocument();
    expect(screen.getByText(/Guardar cambios/i)).toBeInTheDocument();
  });

  test('test_display_confirmation_dialog_before_submission', async () => {
    render(
      <Provider store={store}>
        <UpdatePasswordModal idUser="123" open handlerOpen={mockHandlerOpen} />
      </Provider>,
    );

    fireEvent.submit(screen.getByText(/Guardar cambios/i).closest('form'));

    await waitFor(() => {
      expect(
        screen.getByText(/Esta acción no se puede deshacer, ¿Desea continuar\?/i),
      ).toBeInTheDocument();
    });
  });

  test('test_update_password_submission', async () => {
    render(
      <Provider store={store}>
        <UpdatePasswordModal idUser="123" open handlerOpen={mockHandlerOpen} />
      </Provider>,
    );

    fireEvent.submit(screen.getByText(/Guardar cambios/i).closest('form'));

    await waitFor(() => {
      expect(screen.getAllByText(/Actualizar contraseña/i)[1]).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Aceptar/i));

    await waitFor(() => {
      expect(updatePassword).toHaveBeenCalledWith({
        userId: '123',
        passwordData: { password: 'newPassword123' },
      });
      expect(mockHandlerOpen).toHaveBeenCalledWith(false);
    });
  });
});
