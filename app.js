import login from '/src/api/sys/login'
const EventEmitter = require('eventemitter3')

App({
  // 实例化eventemitter
  emitter: new EventEmitter(),

  // 全局变量
  globalData: {
    // 域名，用于发送请求
    host: 'http://121.199.31.107:8081',
    // 组织名称
    corp: '华阳街道社区卫生服务中心',
    // 组织logo，支持本地与http地址
    logo: ''
  },

  // 小程序初始化
  onLaunch(options) {
    // 登录
    login()
  }
})