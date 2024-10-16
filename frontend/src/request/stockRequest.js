import axios from 'axios';
import { API_BASE_URL } from '@/config/serverApiConfig';

import errorHandler from './errorHandler';
import successHandler from './successHandler';

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

export const stockRequest = {
  read: async ({ entity, id }) => {
    try {
      const response = await axios.get(`${entity}/${id}`);
      successHandler(response, {
        notifyOnSuccess: false,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  update: async ({ entity, id, jsonData }) => {
    try {
      const response = await axios.put(`${entity}/update/${id}`, jsonData);
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  delete: async ({ entity, id }) => {
    try {
      const response = await axios.delete(`${entity}/remove/${id}`);
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  filter: async ({ entity, options = {} }) => {
    try {
      const filter = options.filter ? `filter=${options.filter}` : '';
      const equal = options.equal ? `&equal=${options.equal}` : '';
      const query = `?${filter}${equal}`;

      const response = await axios.get(`${entity}/filter${query}`);
      successHandler(response, {
        notifyOnSuccess: false,
        notifyOnFailed: false,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  search: async ({ entity, options = {} }) => {
    try {
      let query = '?';
      Object.keys(options).forEach((key) => {
        query += `${key}=${options[key]}&`;
      });
      query = query.slice(0, -1);
      // headersInstance.cancelToken = source.token;
      const response = await axios.get(`${entity}/search${query}`);

      successHandler(response, {
        notifyOnSuccess: false,
        notifyOnFailed: false,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  list: async ({ entity, options = {} }) => {
    try {
      let query = '?';
      Object.keys(options).forEach((key) => {
        query += `${key}=${options[key]}&`;
      });
      query = query.slice(0, -1);

      const response = await axios.get(`${entity}/list${query}`);

      successHandler(response, {
        notifyOnSuccess: false,
        notifyOnFailed: false,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  listAll: async ({ entity }) => {
    try {
      const response = await axios.get(`${entity}`);

      successHandler(response, {
        notifyOnSuccess: false,
        notifyOnFailed: false,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  post: async ({ entity, jsonData }) => {
    try {
      const response = await axios.post(entity, jsonData);

      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  get: async ({ entity }) => {
    try {
      const response = await axios.get(entity);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  patch: async ({ entity, jsonData }) => {
    try {
      const response = await axios.patch(entity, jsonData);
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  upload: async ({ entity, id, jsonData }) => {
    try {
      const response = await axios.patch(`${entity}/upload/${id}`, jsonData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  source: () => {
    const { CancelToken } = axios;
    const source = CancelToken.source();
    return source;
  },
  getStockProducts: async ({ entity, ids }) => {
    try {
      const response = await axios.post(`${entity}/getStockProducts`, ids);
      successHandler(response, {
        notifyOnSuccess: false,
        notifyOnFailed: false,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  }
};

export default stockRequest;
