import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditProductForm from './EditProductForm';
import * as utils from '@/utils/uploadImageToImgbb';

jest.mock('@/utils/uploadImageToImgbb', () => ({
  uploadImageToImgbb: jest.fn(),
}));

describe('EditProductForm', () => {
  it('se renderiza correctamente', () => {
    const { getByText } = render(
      <EditProductForm
        register={() => {}}
        setValue={() => {}}
        watch={() => {}}
    />,
    );
    expect(getByText(/cargar imagen/i)).toBeInTheDocument();
  });

  it('maneja la carga de imágenes', async () => {
    const mockSetValue = jest.fn();
    utils.uploadImageToImgbb.mockResolvedValue('url-de-la-imagen');
    const { getByLabelText } = render(
      <EditProductForm
        register={() => {}}
        setValue={mockSetValue}
        watch={() => {}}
      />,
    );

    const input = getByLabelText(/cargar imagen/i);
    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => expect(mockSetValue).toHaveBeenCalledWith('imageUrl', 'url-de-la-imagen'));
  });

  it('permite solo números y puntos en el input de precio', () => {
    const mockSetValue = jest.fn();
    const { getByLabelText } = render(
      <EditProductForm
        register={() => {}}
        setValue={mockSetValue}
        watch={() => {}}
      />,
    );

    const inputPrecio = getByLabelText(/precio/i); // Asegúrate de que tu input tenga un aria-label o texto alternativo para encontrarlo
    fireEvent.change(inputPrecio, { target: { value: '12a3.45b' } });

    expect(mockSetValue).toHaveBeenCalledWith('price', '123.45');
  });

  it('limpia el valor de la imagen correctamente', () => {
    const mockSetValue = jest.fn();
    const { getByText } = render(
      <EditProductForm
        register={() => {}}
        setValue={mockSetValue}
        watch={() => {}}
      />,
    );
    const botonRemover = getByText(/remover imagen/i); // Asume que tienes un botón o enlace para remover la imagen
    fireEvent.click(botonRemover);
    expect(mockSetValue).toHaveBeenCalledWith('imageUrl', '');
  });
});
