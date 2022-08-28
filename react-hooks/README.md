# mini React-hooks

:star: [Github repo](https://github.com/whale2002/reacter/tree/master/react-hooks)

```js
let hookStates = []; // 记录所有状态的数组
let hookIndex = 0;
```

## useState

```js
function useState(initialState) {
  hookState[hookIndex] = hookState[hookIndex] || initialState
  
  // 利用闭包，保证setState拿到的是自己的索引
  let currentIndex = hookIndex
  function setState(newState) {
    hookState[currentIndex] = newState
    render()
  }

  return [hookState[hookIndex++], setState]
}
```

## useReducer

```js
function useReducer(reducer, initialState) {
  hookStates[hookIndex] = hookStates[hookIndex] || initialState;
  let currentIndex = hookIndex;

  function dispatch(action) {
    hookStates[currentIndex] = reducer
      ? reducer(hookStates[currentIndex], action)
      : action;
    render();
  }
  return [hookStates[hookIndex++], dispatch];
}
```

## useMemo

```js
function useMemo(factory, deps) {
  if (hookStates[hookIndex]) {
    // 缓存过了
    let [lastMemo, lastDeps] = hookStates[hookIndex];
    // 依赖是否发生变化
    let same = deps.every((item, index) => item === lastDeps[index]);

    if (same) {
      // 依赖不变
      hookIndex++;
      return lastMemo;
    } else {
      // 依赖发生变化
      let newMemo = factory();
      hookStates[hookIndex++] = [newMemo, deps];
      return newMemo;
    }
  }
  // 第一次执行useMemo
  else {
    let newMemo = factory();
    hookStates[hookIndex++] = [newMemo, deps];
    return newMemo;
  }
}
```

## useCallback

```js
function useCallback(callback, deps) {
  if (hookStates[hookIndex]) {
    // 缓存过了
    let [lastCallback, lastDeps] = hookStates[hookIndex];
    // 依赖是否发生变化
    let same = deps.every((item, index) => item === lastDeps[index]);

    if (same) {
      // 依赖不变
      hookIndex++;
      return lastCallback;
    } else {
      // 依赖发生变化
      hookStates[hookIndex++] = [callback, deps];
      return callback;
    }
  }
  // 第一次执行useCallback
  else {
    hookStates[hookIndex++] = [callback, deps];
    return callback;
  }
}
```

## useEffect

```js
function useEffect(callback, deps) {
  if (hookStates[hookIndex]) {
    let [lastDestroy, lastDeps] = hookStates[hookIndex];
    let same = false;
    if (lastDeps) {
      // 空依赖也走这里
      same = deps.every((item, index) => item === lastDeps[index]);
    }
    if (same) {
      // 依赖没有发生变化，继续执行
      hookIndex++;
    } else {
      lastDestroy && lastDestroy();
      let arr = [, deps];
      setTimeout(() => {
        arr[0] = callback();
      });
      hookStates[hookIndex++] = arr;
    }
  }
  // 第一次调用useEffect，hookStates[hookIndex]不存在
  else {
    let arr = [, deps];
    setTimeout(() => {
      arr[0] = callback();
    });
    hookStates[hookIndex++] = arr;
  }
}
```

## useLayoutEffect

```js
function useLayoutEffect(callback, deps) {
  if (hookStates[hookIndex]) {
    let [lastDestroy, lastDeps] = hookStates[hookIndex];
    let same = false;
    if (lastDeps) {
      // 空依赖也走这里
      same = deps.every((item, index) => item === lastDeps[index]);
    }
    if (same) {
      // 依赖没有发生变化，继续执行
      hookIndex++;
    } else {
      lastDestroy && lastDestroy();
      let arr = [, deps];
      queueMicrotask(() => {
        arr[0] = callback();
      });
      hookStates[hookIndex++] = arr;
    }
  }
  // 第一次调用useEffect，hookStates[hookIndex]不存在
  else {
    let arr = [, deps];
    queueMicrotask(() => {
      arr[0] = callback();
    });
    hookStates[hookIndex++] = arr;
  }
}
```

## useRef

```js
function useRef(initialState) {
  hookStates[hookIndex] = hookStates[hookIndex] || { current: initialState };
  return hookStates[hookIndex++];
}
```

## useContext

```js
function useContext(context) {
  return context._currentValue;
}
```

## useImperativeHandle

```js
function useImperativeHandle(ref, handle) {
  ref.current = handle();
}
```

