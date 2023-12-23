import { fetchAPI } from './request';

export async function login(payload) {
  return fetchAPI('login', 'post', payload);
}

export async function sendForgotEmail(payload) {
  return fetchAPI('send', 'post', payload);
}
