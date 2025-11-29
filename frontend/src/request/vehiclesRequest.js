import { request } from '@/request';

const vehiclesRequest = {
  listVehicles: () => request.get({ entity: '/vehicle/listAll' }),
};

export default vehiclesRequest;
