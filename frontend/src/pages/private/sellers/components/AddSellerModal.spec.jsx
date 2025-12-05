import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import AddSellerModal from './AddSellerModal';
import { request } from '@/request';

const mockStore = configureStore([]);

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useForm: () =>
    jest.requireActual('react-hook-form').useForm({
      defaultValues: {
        name: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phone: '1234567890',
        role: 'seller',
      },
    }),
}));

const mockCreate = jest.fn().mockResolvedValue({
  message: 'Se creó el documento',
  success: true,
});

describe('AddSellerModal', () => {
  let store;
  beforeEach(() => {
    store = mockStore({
      crud: {
        create: { isLoading: false },
        update: { isLoading: false },
        current: { result: {} },
      },
    });
    jest.spyOn(request, 'create').mockImplementation(mockCreate);
  }),
    afterEach(() => {
      jest.clearAllMocks();
    });

  test('test_display_confirmation_dialog_before_submission', async () => {
    render(
      <Provider store={store}>
        <AddSellerModal idSeller="" open={true} handlerOpen={jest.fn()} />
      </Provider>
    );

    fireEvent.submit(screen.getByText(/crear nuevo/i).closest('form'));

    await waitFor(() => {
      expect(
        screen.getByText(/esta acción no se puede deshacer, ¿desea continuar\?/i)
      ).toBeInTheDocument();
    });
  });

  test('test_display_confirmation_dialog_for_create', async () => {
    render(
      <Provider store={store}>
        <AddSellerModal idSeller="" open={true} handlerOpen={jest.fn()} />
      </Provider>
    );

    fireEvent.submit(screen.getByText(/crear nuevo/i).closest('form'));

    await waitFor(() => {
      expect(
        screen.getByText(/esta acción no se puede deshacer, ¿desea continuar\?/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/crear nuevo vendedor/i)).toBeInTheDocument();
    });
  });
});
