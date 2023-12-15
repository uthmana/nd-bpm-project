import { getSession } from 'next-auth/react';
import axios from 'axios';
import { log } from '../src/utils/log';
export * from './auth';

export async function fetchAPI(endpoint, method, data, header, accessToken) {
  const session = await getSession();

  let API_URL = '/api/';
  const headers = {
    ...header,
    Platform: 'web',
  };

  //let token = accessToken ? accessToken : session?.user?.accessToken;
  //token ? (headers['Authorization'] = `Bearer ${token}`) : '';

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
  }).catch(({ response }) => {
    if (typeof window === 'undefined') {
      // SERVER SIDE LOGS
      log('\nRESPONSE ERROR =>', response?.status, response?.data, '\n');
    }
    if (response?.status === 401) {
      log('API return 401', response);
    } else if (response?.status === 400) {
      log('API return 400', response);
    }
    return {
      data: [],
      status: response?.status,
      response: response?.data,
    };
  });

  return {
    data: res.data,
    status: res.status,
    response: res,
  };
}

export async function getAvatars() {
  return fetchAPI('avatars');
}

export async function getUsers() {
  return fetchAPI('users');
}
