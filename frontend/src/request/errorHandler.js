import { notification } from 'antd';
import codeMessage from './codeMessage';

const errorHandler = (error) => {
  if (!navigator.onLine) {
    notification.config({
      duration: 10,
      maxCount: 1,
    });
    // Code to execute when there is internet connection
    notification.error({
      message: 'No hay internet',
      description: 'No se pudo conectar con el servidor, Verifique su conexion a internet',
    });
    return {
      success: false,
      result: null,
      message: 'No se pudo conectar con el servidor, Verifique su conexion a internet',
    };
  }

  const { response } = error;

  if (!response) {
    notification.config({
      duration: 10,
      maxCount: 1,
    });
    // Code to execute when there is no internet connection
    notification.error({
      message: 'No hay internet',
      description: 'No se pudo conectar con el servidor, Verifique su conexion a internet',
    });
    return {
      success: false,
      result: null,
      message: 'No se pudo conectar con el servidor, Verifique su conexion a internet',
    };
  }

  if (response && response.data && response.data.jwtExpired) {
    const result = window.localStorage.getItem('auth');
    const jsonFile = window.localStorage.getItem('isLogout');
    const { isLogout } = (jsonFile && JSON.parse(jsonFile)) || false;
    window.localStorage.removeItem('auth');
    window.localStorage.removeItem('isLogout');
    if (result || isLogout) {
      window.location.href = '/logout';
    }
  }

  if (response && response.status) {
    const message = response.data && response.data.message;

    const errorText = message || codeMessage[response.status];
    const { status } = response;
    notification.config({
      duration: 10,
      maxCount: 2,
    });
    notification.error({
      message: `Error ${status}`,
      description: errorText,
    });
    return response.data;
  }
  notification.config({
    duration: 10,
    maxCount: 1,
  });

  if (navigator.onLine) {
    // Code to execute when there is internet connection
    notification.error({
      message: 'No se pudo conectar con el servidor',
      description: 'No se pudo conectar con el servidor, Contacte al administrador del sistema',
    });
    return {
      success: false,
      result: null,
      message: 'No se pudo conectar con el servidor, Contacte al administrador del sistema',
    };
  }
  // Code to execute when there is no internet connection
  notification.error({
    message: 'No hay internet',
    description: 'No se pudo conectar con el servidor, Verifique su conexion a internet',
  });
  return {
    success: false,
    result: null,
    message: 'No se pudo conectar con el servidor, Verifique su conexion a internet',
  };
};

export default errorHandler;
