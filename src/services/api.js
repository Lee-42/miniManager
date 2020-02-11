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

