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

export async function getCustomersWithStock() {
  return fetchAPI('customer?stock=true');
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

export async function markAllNotifAsRead(payload) {
  return fetchAPI(`notification`, 'put', payload);
}

// Add Entry Form Control
export async function addControl(payload) {
  return fetchAPI(`entryControl`, 'put', payload);
}

export async function getEntryControlByfaultId(id) {
  return fetchAPI(`entryControl/${id}`);
}
export async function updateFaultControl(payload) {
  return fetchAPI(`entryControl/${payload.id}`, 'put', payload);
}

// Process
export async function getProcess() {
  return fetchAPI('process');
}
export async function deleteProcess(id) {
  return fetchAPI(`process/${id}`, 'delete');
}

export async function addProcess(payload) {
  return fetchAPI('process', 'put', payload);
}
export async function getProcessById(id) {
  return fetchAPI(`process/${id}`);
}

export async function updateProcess(payload) {
  return fetchAPI(`process/${payload.id}`, 'put', payload);
}

// TechParams
export async function getTechParams() {
  return fetchAPI('techParams');
}
export async function deleteTechParams(id) {
  return fetchAPI(`techParams/${id}`, 'delete');
}

export async function addTechParams(payload) {
  return fetchAPI('techParams', 'put', payload);
}
export async function getTechParamsById(id) {
  return fetchAPI(`techParams/${id}`);
}

export async function updateTechParams(payload) {
  return fetchAPI(`techParams/${payload.id}`, 'put', payload);
}

export async function getMachines() {
  return fetchAPI('machine');
}

export async function addMachineWithParams(payload) {
  return fetchAPI('machine', 'put', payload);
}

export async function updateMachine(payload) {
  return fetchAPI(`machine/${payload.id}`, 'put', payload);
}

export async function deleteMachine(id) {
  return fetchAPI(`machine/${id}`, 'delete');
}

// MachineParams
export async function deleteMachineParams(id) {
  return fetchAPI(`machineParams/${id}`, 'delete');
}

export async function updateMachineWithParams(payload) {
  return fetchAPI(`machine/${payload.id}`, 'put', payload);
}

export async function addMachineParam(payload) {
  return fetchAPI(`machineParams`, 'put', payload);
}

export async function deleteMachineParam(payload) {
  return fetchAPI(`machineParams/${payload.id}`, 'delete');
}

// Fault Settings
export async function getFaultSettings() {
  return fetchAPI('settings');
}

// Final Control
export async function addProcessControl(payload) {
  return fetchAPI('finalControl', 'put', payload);
}

export async function updateProcessControl(payload) {
  return fetchAPI(`finalControl/${payload.id}`, 'put', payload);
}

// Finished Process
export async function getFinishedProcess() {
  return fetchAPI('process?status=finished&result=accept');
}

// Invoice
export async function addInvoice(payload) {
  return fetchAPI('invoice', 'put', payload);
}

export async function getInvoice() {
  return fetchAPI('invoice');
}

export async function deleteInvoice(id) {
  return fetchAPI(`invoice/${id}`, 'delete');
}

export async function updateInvoice(payload) {
  return fetchAPI(`invoice/${payload.id}`, 'put', payload);
}

export async function getInvoiceById(id) {
  return fetchAPI(`invoice/${id}`);
}
