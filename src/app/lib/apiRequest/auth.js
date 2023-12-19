import { fetchAPI } from './request';

export async function login(payload) {
  return fetchAPI('login', 'post', payload);
}
