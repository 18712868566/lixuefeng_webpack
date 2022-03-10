const axios = require('axios').default;
// 当创建实例的时候配置默认配置
const instance = axios.create({
  method: 'post',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  // transformRequest是你在data传输前进行数据处理，如果不处理你的数据会显示object.object
  transformRequest: [function (data) {
    // 对 data 进行任意转换处理
    let ret = '';
    for (const it in data) {
      ret += `${encodeURIComponent(it)}=${encodeURIComponent(data[it])}&`;
    }
    return ret;
  }],
});

// 添加请求拦截器
instance.interceptors.request.use((config) => {
  // 在发送请求之前做些什么
  console.log('loading');

  return config;
}, (error) =>
  // 对请求错误做些什么
  Promise.reject(error));

// 添加响应拦截器
instance.interceptors.response.use((response) => {
  // 对响应数据做点什么
  console.log('loading end!');
  return response;
}, (error) =>
  // 对响应错误做点什么
  Promise.reject(error));
/* ======================= $axios end ======================= * */
var Projet_Global_Parameter = {
  // 重复点击开关
  bOff: true, // 自定义开关 布尔值
  bEmail: null, // 是否是一个邮箱 布尔值
  upData: null, // url中返回的携带的参数
  aUrlData: [], // 存储url中返回的参数数组
  user_from_uid: '', // 分享参数
  // 补0操作 如果数字为3，则输出0003，不够位数就在之前补足0，
  PrefixInteger(num, length) {
    return (`0000000000000000${num}`).substr(-length);
  },
  // 获取返回链接的参数对象
  getUrlData() {
    url = window.location.href; // 获取当前页面的url
    // console.log(url)
    if (url.indexOf('?role_id') == -1) {
      arr = url;
      // console.log('没找到');
    } else {
      arr = url.split('?')[1].split('&');
      // console.log('找到了');
      const enUrl = decodeURI(url); // 解码
      const len = enUrl.length; // 获取url的长度值
      const a = enUrl.indexOf('?'); // 获取第一次出现？的位置下标
      const b = enUrl.substr(a + 1, len); // 截取问号之后的内容
      const c = b.split('&'); // 从指定的地方将字符串分割成字符串数组
      var arr = new Array(); // 新建一个数组
      for (let i = 0; i < c.length; i++) {
        const d = c[i].split('=')[1]; // 从=处将字符串分割成字符串数组,并选择第2个元素
        arr.push(d); // 将获取的元素存入到数组中
      }

      return arr;
    }
  },
  resGetUrlData() {
    // 浏览器参数,返回数组
    Projet_Global_Parameter.aUrlData = Projet_Global_Parameter.getUrlData();
    if (Projet_Global_Parameter.aUrlData) {
      if (Projet_Global_Parameter.aUrlData[0]) {
        if (typeof (Projet_Global_Parameter.aUrlData[0]) === undefined) {
          // console.log('没有参数啥也不干');
          Projet_Global_Parameter.upData = '';
        } else {
          Projet_Global_Parameter.upData = Projet_Global_Parameter.aUrlData[0];
          console.log(`看见参数了${Projet_Global_Parameter.upData}`);
        }
      }
    }
  },
  // 复制粘贴功能
  tapCopy($id) {
    Projet_Global_Parameter.selectText($id);
    document.execCommand('copy');
  },
  // 选中文本
  selectText(element) {
    const text = document.getElementById(element);
    // 做下兼容
    if (document.body.createTextRange) { // 如果支持
      var range = document.body.createTextRange(); // 获取range
      range.moveToElementText(text); // 光标移上去
      range.select(); // 选择
    } else if (window.getSelection) {
      const selection = window.getSelection(); // 获取selection
      var range = document.createRange(); // 创建range
      range.selectNodeContents(text); // 选择节点内容
      selection.removeAllRanges(); // 移除所有range
      selection.addRange(range); // 添加range
      /* if(selection.setBaseAndExtent){
                   selection.setBaseAndExtent(text, 0, text, 1);
                   } */
    } else {
      console.log('请稍后再试');
    }
  },
  // 校验邮箱
  isEmail(strEmail) {
    if (strEmail.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1) {
      return true;
    }
    return false;
  },
  // 检查用户信息
  async getCheckRoleId(gameId) {
    const res = await instance.get('/first-year/check-role-id', {
      params: {
        user_id: gameId,
      },
    });
    // console.log(res.data)
    const { data } = res.data;

    if (res.data.code == 0) {
      // dialog.closeDiv();
      Projet_Global_Parameter.getUserInfo();
    }
  },
  // 获取用户信息
  async getUserInfo() {
    const res = await instance.post('/pre/get-user-info');
    console.log(res.data);
    const { data } = res.data;
    if (res.data.code == 0) {
      // 登陆状态
      sessionStorage.setItem('sess-isLogin', JSON.stringify(true));
      // 新老用户 //1新玩家
      sessionStorage.setItem('sess-isNew', JSON.stringify(data.user_info.is_new));
      // 分享状态
      sessionStorage.setItem('sess-isShare', JSON.stringify(data.user_info.is_share));

      console.log(data.user_info.is_watch_send);

      console.log($('.box5'));
    }
  },
  // 相加函数
  add(a, b) {
    return a + b;
  },
};

export { Projet_Global_Parameter };
