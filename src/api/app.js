import axios from 'axios';
import config from 'config';

export const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: 30000,
  headers: {
    'X-Api-Key': config.api.apiKey
  }
});

export const request = async (method, url, data = {}) => {
  try {
    const { data: responseData } = await api[method](url, data);

    if (responseData.success) {
      return responseData.data;
    } else {
      throw new Error(responseData.message || 'An unknown error occured.');
    }
  } catch (error) {
    // Always handle the errors here if possible, so we know what to hide by default
    const { response } = error;

    throw new Error(response?.data?.message || 'An unknown error occured.');
  }
}

