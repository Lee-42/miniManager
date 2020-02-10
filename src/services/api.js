import { stringify } from 'qs';
import request from '../utils/request';


// 其他用户
export async function queryUser(params) {
    return request(`/api/getUserList?${stringify(params)}`);
  }
  
  export async function addUser(params) {
    return request('/api/addUser', {
      method: 'POST',
      body: params,
    });
  }
  export async function updateUser(params) {
    return request('/api/updateUser', {
      method: 'POST',
      body: params,
    });
  }
  
  export async function delUser(params){
    return request('/api/delUser', {
        method: 'POST',
        body: params,
    });
  }

