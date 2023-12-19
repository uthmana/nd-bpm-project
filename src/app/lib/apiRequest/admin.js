import { fetchAPI } from './request';

export async function getUsers() {
  return fetchAPI('users');
}
