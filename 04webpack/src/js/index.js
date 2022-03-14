import '../css/style.css';
import '../css/style.less';
import '../css/style.scss';

import $ from 'jquery';

import { ProjetGlobalParameter } from './webmain';
// 处理js兼容 -- 更多新语法 安装后直接引入  --- 已经废弃
// import '@babel/polyfill';
import {
  name,
  play,
  age,
} from './a';

// eslint-disable-next-line
console.log($);

// eslint-disable-next-line
console.log(ProjetGlobalParameter.getUserInfo());

function add(x, y) {
  return x * y;
}

// console.log(Projet_Global_Parameter.add(50, 52));

// 下一行eslint所有的规则都失效 （下一行不进行eslist检查）
// eslint-disable-next-line
console.log(add(2, 5));
// eslint-disable-next-line
console.log(add(5, 5));

// es6 箭头函数
const append = (x, y) => x * y;
// eslint-disable-next-line
console.log(append(10, 10));
// eslint-disable-next-line
console.log(name);
// eslint-disable-next-line
console.log(play());
// eslint-disable-next-line
console.log(age);

const p = new Promise((res) => {
  setTimeout(() => {
    const data = 'HMR数据库中的数据';

    // resolve
    res(data); // 表示成功
  }, 1000);
});

p.then((value) => { // 成功
  // eslint-disable-next-line
    console.log(value);
}, (reason) => { // 错误
  // eslint-disable-next-line
    console.error(reason);
});
