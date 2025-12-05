import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import AddCustomerModal from './AddCustomerModal';
import { request } from '@/request';

const mockStore = configureStore([]);

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useForm: () =>
    jest.requireActual('react-hook-form').useForm({
      defaultValues: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        number: '1234567890',
        documentType: 'DNI',
        documentNumber: '12345678',
        ivaCondition: 'Responsable Inscripto',
        address: {
          city: 'Buenos Aires',
          state: 'Buenos Aires',
          street: 'Av. Corrientes',
          streetNumber: '1234',
          zipCode: '1001',
        },
      },
    }),
}));

const mockCreate = jest.fn().mockResolvedValue({
  message: 'Se creó el documento',
  success: true,
});

describe('AddCustomerModal', () => {
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
        <AddCustomerModal idCustomer="" open={true} handlerOpen={jest.fn()} />
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
        <AddCustomerModal idCustomer="" open={true} handlerOpen={jest.fn()} />
      </Provider>
    );

    fireEvent.submit(screen.getByText(/crear nuevo/i).closest('form'));

    await waitFor(() => {
      expect(
        screen.getByText(/esta acción no se puede deshacer, ¿desea continuar\?/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/crear nuevo cliente/i)).toBeInTheDocument();
    });
  });

  test('test_display_edit_mode_for_existing_customer', async () => {
    const existingCustomer = {
      _id: '123',
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      number: '9876543210',
      documentType: 'CUIT',
      documentNumber: '87654321',
      ivaCondition: 'Consumidor Final',
      address: {
        city: 'Cordoba',
        state: 'Cordoba',
        street: 'Av. Colon',
        streetNumber: '5678',
        zipCode: '5000',
      },
    };

    store = mockStore({
      crud: {
        create: { isLoading: false },
        update: { isLoading: false },
        current: { result: existingCustomer },
      },
    });

    render(
      <Provider store={store}>
        <AddCustomerModal idCustomer="123" open={true} handlerOpen={jest.fn()} />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/editar cliente/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('jane.doe@example.com')).toBeInTheDocument();
    });
  });
});
