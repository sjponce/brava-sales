import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import AddSellerModal from './AddSellerModal';

const mockStore = configureStore([]);

describe('AddSellerModal', () => {
  let store;
  beforeEach(() => {
    store = mockStore({
      crud: {
        create: { isLoading: false },
        current: { result: {} },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('test_display_confirmation_dialog_before_submission', async () => {
    render(
      <Provider store={store}>
        <AddSellerModal idSeller="" open={true} handlerOpen={jest.fn()} />
      </Provider>
    );

    fireEvent.submit(screen.getByText(/crear vendedor/i).closest('form'));

    await waitFor(() => {
      expect(
        screen.getByText(/esta accion no se puede deshacer, ¿desea continuar\?/i)
      ).toBeInTheDocument();
    });
  });

  test('test_display_confirmation_dialog_for_create', async () => {
    render(
      <Provider store={store}>
        <AddSellerModal idSeller="" open={true} handlerOpen={jest.fn()} />
      </Provider>
    );

    fireEvent.submit(screen.getByText(/crear vendedor/i).closest('form'));

    await waitFor(() => {
      expect(
        screen.getByText(/esta accion no se puede deshacer, ¿desea continuar\?/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/crear nuevo vendedor/i)
      ).toBeInTheDocument();

    });
  });
});
