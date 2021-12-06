import '../css/style.css';
import '../css/style.less';
import '../css/style.scss';

// 处理js兼容 -- 更多新语法 安装后直接引入  --- 已经废弃
// import '@babel/polyfill';

import {
  name,
  play,
  age,
  job,
} from './a';

if (module.hot) {
  // 如果mode.hot为 true,说明开启HMR功能 ---> 让HMR功能代码生效
  module.hot.accept('./a.js', () => {
    // 方法会监听 a.js 文件的变化, 一旦发生变化,其他模块不会重新打包构建
    // 针对多模块优化方式 1000-10000个模块时
    // 文件发生变化时,做点什么
    play();
    job();
  });
}

function add(x, y) {
  return x * y;
}

// 下一行eslint所有的规则都失效 （下一行不进行eslist检查）
// eslint-disable-next-line
console.log(add(2, 5));
console.log(add(20, 5));

// es6 箭头函数
const append = (x, y) => x * y;

console.log(append(10, 10));

console.log(name);
console.log(play());
console.log(age);
console.log(job());

const p = new Promise((res) => {
  setTimeout(() => {
    const data = 'HMR数据库中的数据';

    // resolve
    res(data); // 表示成功
  }, 1000);
});

p.then((value) => { // 成功
  console.log(value);
}, (reason) => { // 错误
  console.error(reason);
});
