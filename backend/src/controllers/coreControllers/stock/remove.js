const remove = async ( req, res, axiosInstance ) => {
    try {
        const { id } = req.params || {};
        const apiUrl = `${process.env.STOCK_API}/product/${id}`;
    
        const response = await axiosInstance.delete( apiUrl );
    
        return res.status( 200 ).json( {
        success: true,
        result: response.data,
        message: 'Se elimino el producto',
        } );
    } catch ( error ) {
        if ( error.response && error.response.status === 404 ) {
        return res.status( 404 ).json( {
            success: false,
            result: null,
            message: 'No se encontró el producto',
        } );
        }
    
        console.error( 'Error deleting product from stock API:', error );
        return res.status( 500 ).json( {
        success: false,
        result: null,
        message: 'Ocurrió un error contactando a Stock',
        error: error.message,
        } );
    }
};

module.exports = remove;
