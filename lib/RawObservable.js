import tap from 'tap'
import { deferredPromise, pipe } from './utils'

const GEN_SYM = Symbol()

export function toGenerator(rawObservable) {
    return rawObservable[GEN_SYM]
}

export default class RawObservable {
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
    for await (const _ of src);
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
