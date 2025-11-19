import axios from 'axios';
import { API_BASE_URL } from '@/config/serverApiConfig';
import errorHandler from './errorHandler';
import successHandler from './successHandler';

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

const travelsRequest = {
  listTravels: async () => {
    try {
      const response = await axios.get('/travel/listAll');
      successHandler(response, { notifyOnSuccess: false, notifyOnFailed: false });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  deleteTravel: async (travelId) => {
    try {
      const response = await axios.delete(`travel/delete/${travelId}`);
      successHandler(response, { notifyOnSuccess: true, notifyOnFailed: true });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  createTravel: async (payload) => {
    try {
      const response = await axios.post('/travels', payload);
      // keep silent here; upstream can toast if needed
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  assignOrders: async (travelId, orderIds) => {
    try {
      const response = await axios.post(`/travels/${travelId}/assign-orders`, { orderIds });
      successHandler(response, { notifyOnSuccess: true, notifyOnFailed: true });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  getDetails: async (travelId) => {
    try {
      const response = await axios.get(`/travels/${travelId}/details`);
      successHandler(response, { notifyOnSuccess: false, notifyOnFailed: true });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  startTravel: async (travelId) => {
    try {
      const response = await axios.post(`/travels/${travelId}/start`);
      successHandler(response, { notifyOnSuccess: true, notifyOnFailed: true });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  arriveStop: async (travelId, stopId) => {
    try {
      const response = await axios.post(`/travels/${travelId}/stops/${stopId}/arrive`);
      successHandler(response, { notifyOnSuccess: true, notifyOnFailed: true });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  recordDeliveries: async (travelId, deliveries) => {
    try {
      const response = await axios.post(`/travels/${travelId}/deliveries`, { deliveries });
      successHandler(response, { notifyOnSuccess: true, notifyOnFailed: true });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  recordFailedDeliveries: async (travelId, failures, reason) => {
    try {
      const response = await axios.post(`/travels/${travelId}/deliveries/failed`, { failures, reason });
      successHandler(response, { notifyOnSuccess: true, notifyOnFailed: true });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  completeTravel: async (travelId) => {
    try {
      const response = await axios.post(`/travels/${travelId}/complete`);
      successHandler(response, { notifyOnSuccess: true, notifyOnFailed: true });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  addExtraStock: async (travelId, items) => {
    try {
      const response = await axios.post(`/travels/${travelId}/extra-stock`, { items });
      successHandler(response, { notifyOnSuccess: true, notifyOnFailed: true });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
};

export default travelsRequest;