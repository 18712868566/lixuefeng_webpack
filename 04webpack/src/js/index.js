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

function add(x, y) {
  return x * y;
}

// 下一行eslint所有的规则都失效 （下一行不进行eslist检查）
// eslint-disable-next-line
console.log(add(2, 5));
console.log(add(5, 5));

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
