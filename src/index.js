import _ from 'lodash'
// 必须 ./style.css
import style from "./style.css"   // 这种情况是 css-loader 中options 中有内容 是模块化的css 否者是 import "./style.css"

function component() {
  // 这里主要做一个事 创建节点并且将导入的css类加入到节点中
  const element = document.createElement('div');
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  // 也可以使用style['red'] 来调用 
  // 当然 通过数组或者对象来调用red的时候 在下面的css-loader options需要有内容
  // 否则是 element.classList.add("red")
  element.classList.add(style.red)
  return element;
}
document.write("hello world");
document.body.appendChild(component());