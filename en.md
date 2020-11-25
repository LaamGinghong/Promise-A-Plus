# Promsie A+ handwriting

## Term

### Fulfill

It refers to the series of operations that a Promise performs when it succeeds, such as state changes, the execution of callbacks. Although the word "resolve" is used in the specification, "resolve" is now commonly used instead.

### Reject

This is an operation that happens when a promise fails.

### Eventual value

The so-called final value refers to the value that promise is resolved and passed to resolve callback. Because promise has one-time characteristics, when this value is passed, it marks the end of promise waiting state. Therefore, it is called final value, also referred to as value. 

### Reason

The reason for rejection is that the promise was rejected is the value passed to the reject callback function.

## The state of the Promise

>   The current state of a Promise must be one of three

### Pending

In the wait state, the promise can migrate to execution and rejection states.

### Fulfilled

In the execution state, the promise cannot migrate to any other state; it must have an immutable final value.

### Rejected

In the rejection state, a promise cannot move to any other state; it must have an immutable cause.

## Then

>   A standard Promise A+ must provide A then method to access the current value, the final value, and the evidence.

The Promise then method takes two arguments:

```js
promise.then(onFulfilled, onRejected)
```

OnFulfilled and onRejected are optional parameters. And if they are not functions, they must be ignored.

### OnFulfilled

if onFulfilled is a function:

*   When the promise execution ends, it must be called. The first parameter is the final value of promise.
*   Promise cannot be called until the end of its execution;
*   It cannot be called more than once.

### OnRejected

if onRejected is a function:

*   When promise is rejected, it must be called. The first argument is the promise's cause.
*   Promise can't be called before it's rejected;
*   It cannot be called more than once.

### Multiple calls

The then method can be called multiple times by the same promise:

*   When promise is successfully implemented, all ondepressing will be recalled in accordance with its registration order.
*   When promise is rejected, all onRejected calls back in the order in which you have to register.

### Return

The return value of the then method can be any value. If the return value is a new Promise, the next then is called after the new Promise is executed. If the return value is not a Promise, then the next then is called immediately.

### Run the application

1.  Run the shell `yarn start` to start a local http server. The port number defaults to 3000. If you want to modify, please modify `server/index.js` .
2.  Run the shell `yarn test` to run the script to see the output.

