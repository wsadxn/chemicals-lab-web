import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryUsers(params) {
  return request(`/server/api/user/query?${stringify(params)}`);
}

export async function queryCurrent(params) {
  return request('/server/api/user/currentUser', {
    method: 'POST',
    body: params,
  });
}

export async function updateUserInfo(params) {
  return request('/server/api/user/updateUserInfo', {
    method: 'POST',
    body: params,
  });
}

export async function getUserSd(params) {
  return request(`/server/api/user/getUserSd?identity=${params}`);
}

export async function deleteUser(params) {
  return request(`/server/api/user/delete?id=${params}`);
}