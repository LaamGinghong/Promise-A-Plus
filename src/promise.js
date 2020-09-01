import check from './check.js'

class Promise {
  static resolve(value) {
    if (value instanceof Promise) return value
    return new Promise((resolve, reject) => {
      if (value && value.then && typeof value.then === 'function') {
        value.then(resolve, reject)
      } else {
        resolve(value)
      }
    })
  }

  static reject(reason) {
    if (reason instanceof Promise) return reason
    return new Promise((resolve, reject) => {
      if (reason && reason.then && typeof reason.then === 'function') {
        reason.then(resolve, reject)
      } else {
        reject(reason)
      }
    })
  }

  static all(promises) {
    if (!promises || typeof promises[Symbol.iterator] !== 'function') {
      throw TypeError(
        `${typeof promises} is not iterable (cannot read property Symbol(Symbol.iterator))`,
      )
    }

    let index = 0
    const res = []

    return new Promise((resolve, reject) => {
      const n = promises.length
      if (!n) return []
      else {
        function processPromise(value, i) {
          res[i] = value
          if (++index === n) resolve(res)
        }

        for (let i = 0; i < n; i++) {
          Promise.resolve(promises[i]).then(
            (value) => {
              processPromise(value, i)
            },
            (reason) => {
              reject(reason)
            },
          )
        }
      }
    })
  }

  static race(promises) {
    if (!promises || typeof promises[Symbol.iterator] !== 'function') {
      throw TypeError(
        `${typeof promises} is not iterable (cannot read property Symbol(Symbol.iterator))`,
      )
    }

    if (!promises.length) {
      throw Error('Promise.race need length')
    }

    return new Promise((resolve, reject) => {
      for (const promise of promises) {
        Promise.resolve(promise).then(
          (value) => {
            resolve(value)
          },
          (reason) => {
            reject(reason)
          },
        )
      }
    })
  }

  state = 'pending'
  value = null
  reason = null

  onFulfilledCallback = []
  onRejectedCallback = []

  constructor(executor) {
    if (typeof executor !== 'function') {
      throw TypeError('executor is not a function!')
    }

    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)

    executor(this.resolve, this.reject)
  }

  resolve(value) {
    if (this.state === 'pending') {
      this.state = 'fulfilled'
      this.value = value

      this.onFulfilledCallback.forEach((fn) => {
        fn(this.value)
      })
    }
  }

  reject(reason) {
    if (this.state === 'pending') {
      this.state = 'rejected'
      this.reason = reason

      this.onRejectedCallback.forEach((fn) => {
        fn(this.reason)
      })
    }
  }

  then(onFulfilled, onRejected) {
    if (typeof onFulfilled !== 'function') {
      onFulfilled = function (value) {
        return value
      }
    }
    if (typeof onRejected !== 'function') {
      onRejected = function (reason) {
        return reason
      }
    }

    const promise = new Promise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        try {
          const result = onFulfilled(this.value)
          check(promise, result, resolve, reject)
        } catch (e) {
          reject(e)
        }
      }
      if (this.state === 'rejected') {
        try {
          const result = onRejected(this.reason)
          check(promise, result, resolve, reject)
        } catch (e) {
          reject(e)
        }
      }
      if (this.state === 'pending') {
        this.onFulfilledCallback.push((value) => {
          try {
            const result = onFulfilled(value)
            check(promise, result, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
        this.onRejectedCallback.push((reason) => {
          try {
            const result = onRejected(reason)
            check(promise, result, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }
    })
    return promise
  }

  finally(callback) {
    return this.then(
      () => Promise.resolve(callback()),
      () => Promise.reject(callback()),
    )
  }
}

export default Promise
