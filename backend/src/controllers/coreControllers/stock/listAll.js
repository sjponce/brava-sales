const getSalesProducts = require('./getSalesProducts');
const getLatestPrice = require('./getLatestPrice');

const responseMock = {
  status: 200,
  success: true,
  data: {
    'ART 2350': [
      {
        id: 10,
        name: 'ART 2350',
        description: 'Linea Sportech',
        color: 'Negro',
        imageUrl: 'https://i.ibb.co/0qwr8MN/Whats-App-Image-2023-11-14-at-01-57-31-2.jpg',
        price: 18200,
      },
    ],
    'ART 2920': [
      {
        id: 8,
        name: 'ART 2920',
        description: 'Ninguna',
        color: 'Negro',
        imageUrl: 'https://i.ibb.co/W3K0MLz/Whats-App-Image-2023-11-14-at-01-57-31-4.jpg',
        price: 19900,
      },
    ],
    'ART 3030': [
      {
        id: 35,
        name: 'ART 3030',
        description: '',
        color: 'Blanco',
        imageUrl: '',
        price: 13004,
      },
    ],
    'ART 3070': [
      {
        id: 11,
        name: 'ART 3070',
        description: 'Casual',
        color: 'Camel',
        imageUrl: '',
        price: 17000,
      },
    ],
    'ART 3870': [
      {
        id: 26,
        name: 'ART 3870',
        description: 'Zapatilla casual',
        color: 'Blanco',
        imageUrl: 'https://i.ibb.co/yXfSSYP/12250320001-ult4.jpg',
        price: 17000,
      },
    ],
    'ART 3910': [
      {
        id: 40,
        name: 'ART 3910',
        description: 'Kids',
        color: 'Blanco',
        imageUrl: 'https://i.ibb.co/Ctr9qfM/dh0melnf.png',
        price: 11000,
      },
    ],
    'ART 4000': [
      {
        id: 9,
        name: 'ART 4000',
        description: 'Oxford',
        color: 'Camel',
        imageUrl: 'https://i.ibb.co/gJgdT4B/Whats-App-Image-2023-11-14-at-01-57-31-3.jpg',
        price: 29150,
      },
    ],
    'ART 4900': [
      {
        id: 7,
        name: 'ART 4900',
        description: 'Linea Lady (dama)',
        color: 'Negro',
        imageUrl: 'https://i.ibb.co/Thy8Yv3/Whats-App-Image-2023-11-14-at-01-57-31-1.jpg',
        price: 24500,
      },
      {
        id: 45,
        name: 'ART 4900',
        description: 'Linea Lady (dama)',
        color: 'Blanco',
        imageUrl: '',
        price: 25000,
      },
    ],
    'ART Test 01': [
      {
        id: 48,
        name: 'ART Test 01',
        description:
          '– Sandalias Green & Black.\n\n– Acceso: abrojo.\n\n– Base de goma eva.\n\n– Altura de taco: 2 cm. Plataforma 1.\n\nProducto realizado con cuero genuino.',
        color: 'Blanco',
        imageUrl: '',
        price: 0,
      },
    ],
    'Art 2020': [
      {
        id: 32,
        name: 'Art 2020',
        description: 'Vacia',
        color: '',
        imageUrl: '',
        price: 14400,
      }, 
    ],
    'Art 3150': [
      {
        id: 41,
        name: 'Art 3150',
        description: 'Zapatilla línea casual, combinación Rojo-Blanco.',
        color: 'Rojo',
        imageUrl: 'https://i.ibb.co/hBs3Fnr/il-570x-N-2514084423-f8ex.jpg',
        price: 18000,
      },
    ],
  },
};

const listAll = async (req, res, axiosInstance) => {
  try {
    axiosInstance;
    // TODO: Removed stock since its down Release 1.3.0
    /* const apiUrl = `${process.env.STOCK_API}/product/byNameMap`;
    const stockCall = await axiosInstance.get(apiUrl); */
    const stockData = responseMock.data;
    const salesData = await getSalesProducts();

    if (!stockData) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No se encontraron productos en stock',
      });
    }

    if (salesData.length === 0) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No se encontraron productos en ventas',
      });
    }

    const combinedProducts = await Promise.all(
      salesData.map(async (product) => {

        const stockInfo = stockData[product.stockId] || [];
        const latestPrice = await getLatestPrice(product._id);

        const combinedStockInfo = {
          ...product.toObject(),
          price: latestPrice,
          variations: stockInfo.map((stockItem) => ({
            id: stockItem.id,
            color: stockItem.color,
            imageUrl: stockItem.imageUrl,
          })),
        };

        return combinedStockInfo;
      })
    );

    const products = combinedProducts.flat();

    return res.status(200).json({
      success: true,
      result: products,
      message: 'Se encontraron los productos',
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

