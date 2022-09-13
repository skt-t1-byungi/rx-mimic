import tap from './tap'
import { deferredPromise, pipe } from './utils'

const GEN_SYM = Symbol()

export function toGenerator(observable) {
    return observable[GEN_SYM]
}

export class RawObservable {
    #gen
    constructor(generator) {
        this.#gen = generator
    }
    pipe(...operators) {
        return new RawObservable(pipe(this.#gen, ...operators))
    }
    subscribe(observer) {
        return { unsubscribe: consume(tap(observer)(this.#gen())).stop }
    }
    get [GEN_SYM]() {
        return this.#gen
    }
}

const consume = stoppable(async function* (src) {
    const stoppedRef = { current: false }
    try {
        for await (const _ of src) {
            if (stoppedRef.current) return
        }
    } finally {
        stoppedRef.current = true
    }
})

function stoppable(generator) {
    return source => {
        let stopped = false
        let defer = null
        const it = generator(source)
        return {
            [Symbol.asyncIterator]() {
                return this
            },
            next(value) {
                return withDefer(it.next(value))
            },
            return(value) {
                return withDefer(it.return(value))
            },
            throw(error) {
                return withDefer(it.throw(error))
            },
            stop() {
                if (stopped) return
                stopped = true
                it.return() // notifies source
                defer?.resolve({ done: true }) // notifies sink
                defer = null
            },
        }
        async function withDefer(promise) {
            try {
                return await Promise.race([
                    promise,
                    (defer = deferredPromise()).promise,
                ])
            } finally {
                if (!stopped) {
                    defer.resolve()
                    defer = null
                }
            }
        }
    }
}

export default class Observable extends RawObservable {
    constructor(factory) {
        super(async function* () {
            const buf = []
            let done = false
            let error = null
            let defer = null
            const resolve = () => {
                defer?.resolve()
                defer = null
            }
            const cleanup = factory({
                next(val) {
                    buf.push(val)
                    resolve()
                },
                error(err) {
                    done = true
                    error = err
                    resolve()
                },
                complete() {
                    done = true
                    resolve()
                },
            })
            try {
                while (!done) {
                    if (buf.length) {
                        yield buf.shift()
                    } else {
                        await (defer = deferredPromise()).promise
                        if (error) {
                            throw error
                        }
                    }
                }
            } finally {
                cleanup?.()
            }
        })
    }
}
