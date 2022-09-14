import tap from './tap.js'
import { deferredPromise, identity, noop, pipe } from './utils.js'

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
        const prev = this.#gen
        return new RawObservable(async function* () {
            yield* pipe(...operators)(prev)
        })
    }
    subscribe(observer) {
        const it = stoppable(tap(observer)(this.#gen))
        ;(async function () {
            for await (const _ of it) {
                if (it.isStopped) return
            }
        })().catch(noop)
        return { unsubscribe: it.stop }
    }
    get [GEN_SYM]() {
        return this.#gen
    }
}

function stoppable(it) {
    let stopped = false
    let defer = null
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
        get isStopped() {
            return stopped
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
                    if (done) return
                    buf.push(val)
                    resolve()
                },
                error(err) {
                    if (done) return
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
                    }
                }
                yield* buf
                if (error) {
                    throw error
                }
            } finally {
                cleanup?.()
            }
        })
    }
}
