const remove = require('./remove');
const axios = require('axios');
const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
jest.mock('axios');

describe('remove', () => {
    let req, res, axiosInstance;

    beforeEach(() => {
        req = { params: { id: '123' } };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        axiosInstance = axios;
    });

    afterAll(() => {
        consoleSpy.mockRestore();
    });

    test('test_remove_successful_deletion', async () => {
        const mockData = { data: 'product deleted' };
        axiosInstance.delete.mockResolvedValue({ data: mockData });

        await remove(req, res, axiosInstance);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            result: mockData,
            message: 'Se elimino el producto',
        });
    });

    test('test_remove_product_not_found', async () => {
        axiosInstance.delete.mockRejectedValue({ response: { status: 404 } });

        await remove(req, res, axiosInstance);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            result: null,
            message: 'No se encontró el producto',
        });
    });

    test('test_remove_unexpected_error', async () => {
        const errorMessage = 'Network Error';
        axiosInstance.delete.mockRejectedValue(new Error(errorMessage));

        await remove(req, res, axiosInstance);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            result: null,
            message: 'Ocurrió un error contactando a Stock',
            error: errorMessage,
        });
    });
});