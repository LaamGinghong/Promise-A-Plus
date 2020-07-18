type PromiseAPlusState = "pending" | "fulfilled" | "rejected";
type PromiseAPlusExecutor<T> = (
  resolve: (value: T) => void,
  reject: (reason: string) => void
) => void;
type PromiseAPlusOnFulfilled<T> = (value: T) => T | void | PromiseAPlus<T>;
type PromiseAPlusOnRejected = (reason: string) => void;

class PromiseAPlus<T> {
  private _value: T;
  private _reason: string;
  private _state: PromiseAPlusState = "pending";

  private onFulFilledCallbacks: PromiseAPlusOnFulfilled<T>[] = [];
  private onRejectedCallbacks: PromiseAPlusOnRejected[] = [];

  constructor(executor: PromiseAPlusExecutor<T>) {
    try {
      executor(this._resolve, this._reject);
    } catch (e) {
      this._reject(e);
    }
  }

  private _resolve = (value: T) => {
    if (this._state === "pending") {
      this._state = "fulfilled";
      this._value = value;

      this.onFulFilledCallbacks.forEach((fn) => {
        fn(this._value);
      });
    }
  };

  private _reject = (reason: string) => {
    if (this._state === "pending") {
      this._state = "rejected";
      this._reason = reason;

      this.onRejectedCallbacks.forEach((fn) => {
        fn(this._reason);
      });
    }
  };

  public then = <U = T>(
    onFulfilled: PromiseAPlusOnFulfilled<T>,
    onRejected?: PromiseAPlusOnRejected
  ) => {
    return new PromiseAPlus<U>((resolve, reject) => {
      if (this._state === "fulfilled") {
        try {
          resolve(onFulfilled(this._value) as any);
        } catch (e) {
          reject(e);
        }
      } else if (this._state === "rejected") {
        try {
          onRejected(this._reason);
        } catch (e) {
          reject(e);
        }
      } else {
        this.onFulFilledCallbacks.push((value) => {
          try {
            resolve(onFulfilled(value) as any);
          } catch (e) {
            reject(e);
          }
        });
        this.onRejectedCallbacks.push((reason) => {
          try {
            onRejected(reason);
          } catch (e) {
            reject(e);
          }
        });
      }
    });
  };
}

const step1 = () =>
  new PromiseAPlus((resolve) => {
    setTimeout(() => {
      console.log(1, "step1");
      resolve(1);
    }, 1000);
  });

const step2 = (value) =>
  new PromiseAPlus((resolve) => {
    setTimeout(() => {
      const value1 = value * 100;
      console.log(value1, "step2");
      resolve(value1);
    }, 2000);
  });

step1()
  .then((value) => step2(value))
  .then((value) => {
    console.log(value);
  });
