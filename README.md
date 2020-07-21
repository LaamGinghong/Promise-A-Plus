# 手写 Promise A+

## 术语

### 解决（fulfill）

指的是一个 promise 成功时进行的一系列操作，如状态的改变、回调的执行。虽然规范中使用 fulfill 来表示解决，但是目前常用 resolve 来取代。

### 拒绝（reject）

指的是一个 promise 失败时进行的操作。

### 终值（eventual value）

所谓终值，指的是 promise 被解决是传递给解决回调的值，由于 promise 有一次性的特征，因此当这个值被传递的时候，标志着 promise 等待态的结束，故称之为终值，也简称为值（value）。

### 据因（reason）

拒绝的原因，指的是 promise 被拒绝是传递给拒绝回调函数的值。



## Promise 的状态

>   一个 Promise 的当前状态必须为以下三种状态中的一种

### 等待态（pending）

处于等待态时，promise 可以迁移至执行态和拒绝态。

### 执行态（fulfilled）

处于执行态时，promise 不能迁移至其他任何状态，必须拥有一个不可变的终值。

### 拒绝态（rejected）

处于拒绝态时，promise 不能迁移至其他任何状态，必须拥有一个不可变的据因。



## Then 方法

>   一个 标准的 Promise A+ 必须提供一个 then 方法以访问当前值、终值和据因

Promise 的 then 方法接受两个参数：

```typescript
promise.then(onFulfilled, onRejected)
```

onFulfilled 和 onRejected 都是可选参数，如果它们不是函数，则它们必须被忽略。

### onFulfilled 特性

如果 onFulfilled 是一个函数：

*   当 promise 执行结束后其必须被调用，其第一个参数为 promise 的终值；
*   在 promise 执行结束前其不可被调用；
*   其被调用次数不可超过一次。

### onRejected 特性

如果 onRejected 是一个函数：

*   当 promise 被拒绝后必须被调用，其第一个参数为 promise 的据因；
*   在 promise 被拒绝前不可被调用；
*   其被调用次数不可超过一次。

### 多次调用

then 方法可以被同一个 promise 多次调用：

*   当 promise 成功执行时，所有 onFulfilled 按照其注册顺序依次回调；
*   当 promise 被拒绝执行时，所有 onRejected 按照起注册顺序依次回调。

### 返回

then 方法的返回值可以是一个任意值，如果返回值是一个新的 Promise，那么下一个 then 会在新的 Promise 执行后再调用；如果返回值不是一个 Promise，那么下一个 then 则会被立即调用。



## 使用方法

### 安装 RunJS

可以通过安装 RunJS，然后使用 RunJS 打开当前 promiseAPlus.ts 文件声明 PromiseAPlus 类。

### 安装 ts-node

也可以通过安装 ts-node，然后在终端执行 ts-node promiseAPlus.ts 来声明 PromiseAPlus 类。
