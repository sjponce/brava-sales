import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddCustomerForm from './AddCustomerForm';

describe('AddCustomerForm', () => {
  const mockRegister = jest.fn();
  const mockSetValue = jest.fn();
  const mockWatch = jest.fn();
  const mockDocumentTypeOptions = [
    { value: 'dni', label: 'DNI' },
    { value: 'passport', label: 'Passport' },
  ];
  const mockIvaConditionOptions = [
    { value: 'responsable_inscripto', label: 'Responsable Inscripto' },
    { value: 'consumidor_final', label: 'Consumidor Final' },
  ];

  beforeEach(() => {
    mockRegister.mockClear();
    mockSetValue.mockClear();
    mockWatch.mockClear();
  });

  test('test_number_input_filtering', () => {
    const { getByLabelText } = render(
      <AddCustomerForm
        register={mockRegister}
        setValue={mockSetValue}
        watch={mockWatch}
        documentTypeOptions={mockDocumentTypeOptions}
        ivaConditionOptions={mockIvaConditionOptions}
      />
    );

    const numberInput = getByLabelText('Número de teléfono');
    fireEvent.change(numberInput, { target: { value: '123-abc-456' } });

    expect(mockSetValue).toHaveBeenCalledWith('number', '123456');
  });

  test('test_name_input_filtering', () => {
    const { getByLabelText } = render(
      <AddCustomerForm
        register={mockRegister}
        setValue={mockSetValue}
        watch={mockWatch}
        documentTypeOptions={mockDocumentTypeOptions}
        ivaConditionOptions={mockIvaConditionOptions}
      />
    );

    const nameInput = getByLabelText(/Nombre\/Razón Social/i);
    fireEvent.change(nameInput, { target: { value: 'John123 Doe123' } });

    expect(mockSetValue).toHaveBeenCalledWith('name', 'John Doe');
  });

  test('test_document_type_autocomplete', async () => {
    mockWatch.mockReturnValue('dni');

    const { getByLabelText } = render(
      <AddCustomerForm
        register={mockRegister}
        setValue={mockSetValue}
        watch={mockWatch}
        documentTypeOptions={mockDocumentTypeOptions}
        ivaConditionOptions={mockIvaConditionOptions}
      />
    );

    const documentTypeInput = getByLabelText(/Tipo documento/i);

    await waitFor(() => {
      expect(documentTypeInput).toHaveValue('DNI');
    });
  });

  test('test_iva_condition_autocomplete', async () => {
    mockWatch.mockReturnValue('responsable_inscripto');

    const { getByLabelText } = render(
      <AddCustomerForm
        register={mockRegister}
        setValue={mockSetValue}
        watch={mockWatch}
        documentTypeOptions={mockDocumentTypeOptions}
        ivaConditionOptions={mockIvaConditionOptions}
      />
    );

    let ivaConditionInput;
    await waitFor(() => {
      ivaConditionInput = getByLabelText(/Condición IVA/i);
      return ivaConditionInput;
    });
    await waitFor(() => {
      expect(ivaConditionInput).toHaveValue('Responsable Inscripto');
    });
  });
});
