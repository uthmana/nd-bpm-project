import { fetchAPI } from './request';

//Users
export async function getUsers() {
  return fetchAPI('user');
}
export async function getUserById(id) {
  return fetchAPI(`user/${id}`);
}

export async function updateUser(payload) {
  return fetchAPI(`user/${payload.id}`, 'put', payload);
}

export async function deleteUser(id) {
  return fetchAPI(`user/${id}`, 'delete');
}

//Stocks
export async function addStock(payload) {
  return fetchAPI('stock', 'put', payload);
}

export async function getStocks() {
  return fetchAPI('stock');
}

export async function getStockById(id) {
  return fetchAPI(`stock/${id}`);
}

export async function updateStock(payload) {
  return fetchAPI(`stock/${payload.id}`, 'put', payload);
}

export async function deleteStock(id) {
  return fetchAPI(`stock/${id}`, 'delete');
}

// customer
export async function addCustomer(payload) {
  return fetchAPI('customer', 'put', payload);
}

export async function getCustomers() {
  return fetchAPI('customer');
}

export async function getCustomerById(id) {
  return fetchAPI(`customer/${id}`);
}

export async function updateCustomer(payload) {
  return fetchAPI(`customer/${payload.id}`, 'put', payload);
}

export async function deleteCustomer(id) {
  return fetchAPI(`customer/${id}`, 'delete');
}

//File uplaod
export async function uploadFile(formData) {
  return fetchAPI('upload', 'post', formData);
}

//Faults
export async function addFault(payload) {
  return fetchAPI('entry', 'put', payload);
}

export async function getFaults() {
  return fetchAPI('entry');
}

export async function getFaultById(id) {
  return fetchAPI(`entry/${id}`);
}

export async function updateFault(payload) {
  return fetchAPI(`entry/${payload.id}`, 'put', payload);
}

export async function deleteFault(id) {
  return fetchAPI(`entry/${id}`, 'delete');
}

//Notification
export async function getNotifications(payload) {
  return fetchAPI('notification', 'get', payload);
}

export async function updateNotificStatus(payload) {
  return fetchAPI(`notification`, 'post', payload);
}
