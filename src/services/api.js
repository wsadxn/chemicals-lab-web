import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    body: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/server/api/user/login', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}




// Chemicals
export async function queryChemicals(params) {
  return request(`/server/api/chemicals/query?${stringify(params)}`);
}

export async function deleteChemicals(params) {
  return request(`/server/api/chemicals/delete?id=${params}`);
}

export async function checkChemicalsCode(params) {
  return request(`/server/api/chemicals/checkCode?${stringify(params)}`);
}

export async function updateChemicals(params) {
  return request('/server/api/chemicals/updateChemicals', {
    method: 'POST',
    body: params,
  });
}

export async function getChemicalSd() {
  return request(`/server/api/chemicals/getChemicalSd`);
}
export async function getChemicalsNum() {
  return request(`/server/api/chemicals/getChemicalsNum`);
}

// Instrument
export async function queryInstrument(params) {
  return request(`/server/api/instrument/query?${stringify(params)}`);
}

export async function deleteInstrument(params) {
  return request(`/server/api/instrument/delete?id=${params}`);
}

export async function checkInstrumentCode(params) {
  return request(`/server/api/instrument/checkCode?${stringify(params)}`);
}

export async function updateInstrument(params) {
  return request('/server/api/instrument/updateInstrument', {
    method: 'POST',
    body: params,
  });
}

export async function getInstrumentSd() {
  return request(`/server/api/instrument/getInstrumentSd`);
}


// Purchase
export async function queryPurchase(params) {
  return request(`/server/api/purchase/query?${stringify(params)}`);
}

export async function addPurchase(params) {
  return request('/server/api/purchase/addPurchase', {
    method: 'POST',
    body: params,
  });
}

export async function getExistCount(params) {
  return request(`/server/api/purchase/getExistCount?${stringify(params)}`);
}

export async function updatePurchase(params) {
  return request('/server/api/purchase/update', {
    method: 'POST',
    body: params,
  });
}

// order
export async function queryOrder(params) {
  return request(`/server/api/order/query?${stringify(params)}`);
}

export async function getUnusedInsNum(params) {
  return request(`/server/api/order/getUnusedIns?${stringify(params)}`);
}

export async function addOrder(params) {
  return request('/server/api/order/addOrder', {
    method: 'POST',
    body: params,
  });
}

export async function updateOrder(params) {
  return request('/server/api/order/update', {
    method: 'POST',
    body: params,
  });
}

// Notice
export async function queryNotice(params) {
  return request(`/server/api/notice/query?${stringify(params)}`);
}

export async function deleteNotice(params) {
  return request(`/server/api/notice/delete?id=${params}`);
}

export async function updateNotice(params) {
  return request('/server/api/notice/update', {
    method: 'POST',
    body: params,
  });
}

// Inform
export async function queryInform(params) {
  return request(`/server/api/inform/query?${stringify(params)}`);
}

export async function getMonthNum(){
  return request(`/server/api/inform/getMonthNum`);
}

export async function deleteInform(params) {
  return request(`/server/api/inform/delete?id=${params}`);
}

export async function updateInform(params) {
  return request('/server/api/inform/update', {
    method: 'POST',
    body: params,
  });
}