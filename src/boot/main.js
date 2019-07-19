// import something here
const config = require('../config');

// "async" is optional
export default async ({ Vue }) => {
  Vue.prototype.appConfig = config;
}
