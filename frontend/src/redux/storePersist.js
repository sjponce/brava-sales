function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    console.error(e.message);
    return false;
  }
  return true;
}

export const localStorageHealthCheck = async () => {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < localStorage.length; ++i) {
    try {
      const result = window.localStorage.getItem(localStorage.key(i));
      if (!isJsonString(result)) {
        window.localStorage.removeItem(localStorage.key(i));
      }
      if (result && Object.keys(localStorage.key(i)).length === 0) {
        window.localStorage.removeItem(localStorage.key(i));
      }
    } catch (error) {
      window.localStorage.clear();
      // Handle the exception here
      console.error('window.localStorage Exception occurred:', error);
      // You can choose to ignore certain exceptions or take other appropriate actions
    }
  }
};

export const storePersist = {
  set: (key, state) => {
    window.localStorage.setItem(key, JSON.stringify(state));
  },
  get: (key) => {
    const result = window.localStorage.getItem(key);
    if (!result) {
      return false;
    }
    if (!isJsonString(result)) {
      window.localStorage.removeItem(key);
      return false;
    }
    return JSON.parse(result);
  },
  remove: (key) => {
    window.localStorage.removeItem(key);
  },
  getAll: () => window.localStorage,
  clear: () => {
    window.localStorage.clear();
  }
};
