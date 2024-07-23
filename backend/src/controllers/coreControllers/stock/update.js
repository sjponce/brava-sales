const update = async (req, res, axiosInstance) => {
  try {
    const apiUrl = `${process.env.STOCK_API}/product`;
    const id = parseInt(req.params.id);

    const response = await axiosInstance.put(apiUrl, {...req.body, id});

    return res.status(200).json({
      success: true,
      result: response.data,
      message: 'Se actualizo el producto',
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No se encontro el producto',
      });
    }

    console.error('Error updating product from stock API:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Ocurrio un error contactando a Stock',
      error: error.message,
    });
  }
};

module.exports = update;
