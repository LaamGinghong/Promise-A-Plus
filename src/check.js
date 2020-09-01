import Promise from './promise.js'

function check(promise1, promise2, resolve, reject) {
  if (promise1 === promise2) {
    reject('Chaining cycle detected for Promise')
  } else {
    if (promise2 instanceof Promise) {
      promise2.then(resolve, reject)
    } else {
      resolve(promise2)
    }
  }
}

export default check
