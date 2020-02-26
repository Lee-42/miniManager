let domain = 'https://'; //正式域名
if (process.env.NODE_ENV === 'development') {
  //开发环境下, 本地地址
  domain = 'http://127.0.0.1:3001';
}
export default domain;
