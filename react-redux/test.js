// reducer 由来
const array = [1, 2, 3, 4, 5];

const reducer = (sum, cur) => sum + cur;

const sum = array.reduce(reducer);

console.log(sum);

// 上遗憾函数的返回值是下一个函数的参数
function f1(arg) {
  console.log("f1", arg);
  return arg;
}

function f2(arg) {
  console.log("f2", arg);
  return arg;
}

function f3(arg) {
  console.log("f3", arg);
  return arg;
}

function compose(...funs) {
  if (funs.length === 0) return (arg) => arg;
  if (funs.length === 1) return funs[0];

  return funs.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args))
  );
}

compose(f1, f2, f3)("omg");
