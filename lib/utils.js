export const deferredPromise = () => {
    let resolve
    let reject
    const promise = new Promise((res, rej) => {
        resolve = res
        reject = rej
    })
    return { resolve, reject, promise }
}

export const pipe = (...functions) =>
    functions.reduce(
        (prev, fn) =>
            (...args) =>
                fn(prev(...args))
    )

export const noop = () => {}

export const identity = v => v

export const isThenable = v => v?.then === 'function'

export const isArrayLike = v => v?.length === 'number'
