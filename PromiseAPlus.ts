import {
  PromiseAPlusState,
  PromiseAPlusExecutor,
  PromiseAPlusOnFulfilled,
  PromiseAPlusOnReject,
  PromiseAPlusResolve,
  PromiseAPlusReject,
  PromiseAPlusPrototype,
} from "./types";
import validate = WebAssembly.validate;

interface PromiseAPlus<T> {
  resolve(value: T): void;
  reject(reason: string): void;
  then<U = T>(
    onFulfilled?: PromiseAPlusOnFulfilled<U, T>,
    onRejected?: PromiseAPlusOnReject
  ): PromiseAPlus<U>;
}

class PromiseAPlus<T = any> {
  private static resolvePromise<T>(
    promise1: PromiseAPlus<T>,
    promise2: T | PromiseAPlusPrototype<T>,
    resolve: PromiseAPlusResolve<T>,
    reject: PromiseAPlusReject
  ) {
    if (promise1 === promise2) {
      reject("Chaining cycle detected for Promise A+");
    }

    if (promise2 instanceof PromiseAPlus) {
      (promise2 as PromiseAPlus<T>).then(resolve, reject);
    } else {
      resolve(promise2 as T);
    }
  }

  /* 终值 */
  private value: T;
  /* 据因 */
  private reason: string;
  /* 状态 */
  private state: PromiseAPlusState = "pending";
  /* 异步成功回调 */
  private onFulfilledCallback: PromiseAPlusResolve<T>;
  /* 异步失败回调 */
  private onRejectedCallback: PromiseAPlusReject;

  constructor(executor: PromiseAPlusExecutor<T>) {
    this.init();

    try {
      executor(this.resolve, this.reject);
    } catch (e) {
      this.reject(e);
    }
  }

  private init() {
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }

  resolve(value: T) {
    if (this.state === "pending") {
      this.state = "fulfilled";
      this.value = value;

      this.onFulfilledCallback?.(this.value);
    }
  }

  reject(reason: string) {
    if (this.state === "pending") {
      this.state = "rejected";
      this.reason = reason;

      this.onRejectedCallback?.(this.reason);
    }
  }

  then<U = T>(
    onFulfilled?: PromiseAPlusOnFulfilled<T, U>,
    onRejected?: PromiseAPlusOnReject
  ): PromiseAPlus<U> {
    if (!onFulfilled) {
      onFulfilled = function (value) {
        return value as any;
      };
    }
    if (!onRejected) {
      onRejected = function (reason) {
        throw reason;
      };
    }
    const promiseAPlus = new PromiseAPlus<U>((resolve, reject) => {
      if (this.state === "fulfilled") {
        try {
          const result = onFulfilled(this.value);
          PromiseAPlus.resolvePromise<U>(promiseAPlus, result, resolve, reject);
        } catch (e) {
          reject(e);
        }
      }

      if (this.state === "rejected") {
        try {
          onRejected(this.reason);
        } catch (e) {
          reject(e);
        }
      }

      if (this.state === "pending") {
        this.onFulfilledCallback = (value) => {
          try {
            const result = onFulfilled(value);
            PromiseAPlus.resolvePromise<U>(
              promiseAPlus,
              result,
              resolve,
              reject
            );
          } catch (e) {
            reject(e);
          }
        };

        this.onRejectedCallback = function (reason) {
          try {
            onRejected(reason);
          } catch (e) {
            reject(e);
          }
        };
      }
    });
    return promiseAPlus;
  }
}
