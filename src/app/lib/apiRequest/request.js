import { getSession } from 'next-auth/react';
import axios from 'axios';
import { log } from '../../../utils/log';

export async function fetchAPI(endpoint, method, data, header, accessToken) {
  axios.defaults.timeout = 60000;
  const session = await getSession();

  let API_URL = `${process.env.NEXT_PUBLIC_BASE_PATH}/api/`;

  const headers = {
    'Content-Type': 'application/json',
    Platform: 'web',
  };

  log(endpoint, method, data);

  let token = accessToken ? accessToken : session?.user?.accessToken;
  token ? (headers['Authorization'] = `Bearer ${token}`) : '';

  if (typeof window === 'undefined') {
    // SERVER SIDE LOGS
    log('\nFETCH =>', API_URL + endpoint, headers, '\n');
  } else {
    log('FETCH =>', API_URL + endpoint, headers);
  }

  const res = await axios({
    url: API_URL + endpoint,
    method: method || 'get',
    headers: headers,
    data,
  }).catch((error) => {
    const { response } = error;

    if (typeof window === 'undefined') {
      // SERVER SIDE LOGS
      log('\nRESPONSE ERROR =>', response?.status, response?.data, '\n');
    }
    if (response?.status) {
      log(`API return ${response?.status}`, response);
    }
    const errorDetails = {
      status: response?.status,
      data: [],
      response: response?.data,
      error: {
        message: response?.data?.name || response?.data?.message,
        detail: response?.config?.data || response?.data?.meta?.field_name,
      },
    };
    throw new Error(JSON.stringify(errorDetails));
  });

  return {
    data: res.data,
    status: res.status,
    response: res,
  };
}
