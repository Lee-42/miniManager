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

export async function delUser(params) {
  return request('/api/delUser', {
    method: 'POST',
    body: params,
  });
}

// 分类
export async function queryCategory(params) {
  return request(`/api/getCategoryList?${stringify(params)}`);
}

export async function addCategory(params) {
  return request('/api/addCategory', {
    method: 'POST',
    body: params,
  });
}
export async function updateCategory(params) {
  return request('/api/updateCategory', {
    method: 'POST',
    body: params,
  });
}

export async function delCategory(params) {
  return request('/api/delCategory', {
    method: 'POST',
    body: params,
  });
}

// 文章
export async function queryArticle(params) {
  return request(`/api/getArticleListAdmin?${stringify(params)}`);
}

export async function addArticle(params) {
  return request('/api/addArticle', {
    method: 'POST',
    body: params,
  });
}
export async function delArticle(params) {
  return request('/api/delArticle', {
    method: 'POST',
    body: params,
  });
}

export async function updateArticle(params) {
  return request('/api/updateArticle', {
    method: 'POST',
    body: params,
  });
}

export async function getArticleDetail(params) {
  return request('/api/getArticleDetail', {
    method: 'POST',
    body: params,
  });
}

// 管理一级评论
export async function changeComment(params) {
  return request('/api/changeComment', {
    method: 'POST',
    body: params,
  });
}

export async function changeThirdComment(params) {
  return request('/api/changeThirdComment', {
    method: 'POST',
    body: params,
  });
}

// 标签
export async function queryTag(params) {
  return request(`/api/getTagList?${stringify(params)}`);
}

export async function addTag(params) {
  return request('/api/addTag', {
    method: 'POST',
    body: params,
  });
}

export async function delTag(params) {
  return request('/api/delTag', {
    method: 'POST',
    body: params,
  });
}




// 项目
export async function queryProject(params) {
  return request(`/api/getProjectList?${stringify(params)}`);
}

export async function addProject(params) {
  return request('/api/addProject', {
    method: 'POST',
    body: params,
  })
}



//留言
export async function addReplyMessage(params){
  return request('/api/addReplyMessage', {
    method: 'POST',
    body: params,
  })
}

export async function queryMessage(params){
  return request(`/api/getMessageList?${stringify(params)}`);
}

export async function delMessage(params){
  return request('/api/delMessage', {
    method: 'POST',
    body: params,
  })
}

export async function getMessageDetail(params){
  return request('/api/getMessageDetail', {
    method: 'POST',
    body: params,
  })
}