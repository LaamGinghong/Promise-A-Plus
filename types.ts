type PromiseAPlusState = "pending" | "fulfilled" | "rejected";

interface PromiseAPlusExecutor<T> {
  (resolve: PromiseAPlusResolve<T>, reject: PromiseAPlusReject): void;
}

interface PromiseAPlusResolve<T> {
  (value?: T): void;
}

interface PromiseAPlusReject {
  (reason?: string): void;
}

interface PromiseAPlusOnFulfilled<T, U> {
  (value: T): U | PromiseAPlusPrototype<U>;
}

interface PromiseAPlusOnReject {
  (reason: string): void;
}

interface PromiseAPlusPrototype<T> {
  then<U = T>(
    onFulfilled?: PromiseAPlusOnFulfilled<T, U>,
    onRejected?: PromiseAPlusOnReject
  ): PromiseAPlusPrototype<U>;
}

export {
  PromiseAPlusState,
  PromiseAPlusExecutor,
  PromiseAPlusPrototype,
  PromiseAPlusResolve,
  PromiseAPlusReject,
  PromiseAPlusOnFulfilled,
  PromiseAPlusOnReject,
};
