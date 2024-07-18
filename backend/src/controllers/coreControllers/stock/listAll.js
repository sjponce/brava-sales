const listAll = async (req, res, axiosInstance) => {
  try {
    const { id } = req.params || {};
    const apiUrl = `${process.env.STOCK_API}/product${id ? `/${id}` : ''}`;
  
    const response = await axiosInstance.get(apiUrl);
    // TODO: Mocked the _id for sales to wrok for now
    Object.keys(response.data).forEach((key) => {
      response.data[key]._id = '668884e329090074476f8aee';
    });

    return res.status(200).json({
      success: true,
      result: response.data,
      message: 'Se encontro los productos',
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No se encontraron productos',
      });
    }

    console.error('Error fetching products from stock API:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Ocurrio un error contactando a Stock',
      error: error.message,
    });
  }
};

module.exports = listAll;
