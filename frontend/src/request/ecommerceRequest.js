import axios from 'axios';
import { API_BASE_URL } from '@/config/serverApiConfig';

import errorHandler from './errorHandler';
import successHandler from './successHandler';

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

const ecommerceRequest = {
  saveCart: async ({ jsonData }) => {
    try {
      const response = await axios.post('ecommerce/saveCart', jsonData);
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
};

export default ecommerceRequest;
