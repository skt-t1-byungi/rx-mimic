const stoppable = generator => source => {
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
            return await Promise.race([promise, (defer = deferredPromise()).promise])
        } finally {
            if (!stopped) {
                defer.resolve()
                defer = null
            }
        }
    }
}

const deferredPromise = () => {
    let resolve
    let reject
    const promise = new Promise((res, rej) => {
        resolve = res
        reject = rej
    })
    return { resolve, reject, promise }
}

class RawObservable {
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
}

const consume = stoppable(async function* (src) {
    for await (const _ of src);
})

export class Observable extends RawObservable {
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

export const noop = () => {}

export const pipe = (...functions) =>
    functions.reduce(
        (prev, fn) =>
            (...args) =>
                fn(prev(...args))
    )

export const from = source => {
    const src = source
    if (src instanceof RawObservable) {
        return src
    }
    if (typeof src?.then === 'function') {
        return new RawObservable(async function* () {
            yield await src
        })
    }
    return new RawObservable(async function* () {
        if (!Array.isArray(src) && typeof src.length === 'number') {
            src = Array.from(src)
        }
        yield* src
    })
}

export const defer = factory => from(factory())

export const of = (...args) => from(args)

export const fromEvent = (eventEmitter, eventName) =>
    new Observable(sub => {
        const m = eventEmitter
        const listener = ev => sub.next(ev)
        ;(m.addEventListener || m.addListener || m.on).call(m, eventName, listener)
        return () => {
            ;(m.removeEventListener || m.removeListener || m.off).call(m, eventName, listener)
        }
    })

export const timer = (ms, intervalTime) =>
    concat(
        new Observable(sub => {
            const id = setTimeout(sub.next, ms, 0)
            return () => clearTimeout(id)
        }),
        intervalTime ? interval(intervalTime) : EMPTY
    )

export const EMPTY = new RawObservable(async function* () {})

export const interval = ms =>
    new Observable(sub => {
        let i = 0
        const id = setInterval(() => sub.next(i++), ms)
        return () => clearInterval(id)
    })

export const concat = (...sources) =>
    defer(async function* () {
        for (const src of sources) {
            yield* from(src)
        }
    })

export const combineLatest = (...sources) =>
    new Observable(sub => {
        const VOID = Symbol()
        const buf = Array(sources.length).fill(VOID)
        const offs = []
        const cleanup = () => offs.forEach(off => off())
        let completes = 0
        sources.forEach((src, i) => {
            offs.push(
                from(src).subscribe({
                    next(value) {
                        buf[i] = value
                        if (buf.every(v => v !== VOID)) {
                            sub.next(buf.slice())
                        }
                    },
                    error(err) {
                        cleanup()
                        sub.error(err)
                    },
                    complete() {
                        if (++completes === sources.length) {
                            cleanup()
                            sub.complete()
                        }
                    },
                }).unsubscribe
            )
        })
        return cleanup
    })

export const tap = observer =>
    async function* (src) {
        const ob = observer
        if (typeof ob === 'function') {
            ob = { next: ob }
        }
        try {
            for await (const v of src) {
                ob?.next(v)
                yield v
            }
            ob?.complete?.()
        } catch (err) {
            ob?.error?.(err)
            throw err
        }
    }

export const take = n =>
    async function* (src) {
        let i = 0
        for await (const v of src) {
            if (i++ < n) yield v
            if (i === n) return
        }
    }

export const takeLast = n =>
    async function* (src) {
        const buf = []
        for await (const v of src) {
            buf.push(v)
            if (buf.length > n) buf.shift()
        }
        yield* buf
    }

export const skip = n =>
    async function* (src) {
        let i = 0
        for await (const v of src) {
            if (i++ >= n) yield v
        }
    }

export const skipLast = n =>
    async function* (src) {
        const buf = []
        for await (const v of src) {
            buf.push(v)
            if (buf.length > n) yield buf.shift()
        }
    }

export const first = (fn = v => v) => pipe(filter(fn), take(1))

export const last = (fn = v => v) => pipe(filter(fn), takeLast(1))

export const map = fn =>
    async function* (src) {
        let i = 0
        for await (const v of src) yield fn(v, i++)
    }

export const mapTo = value => map(() => value)

export const filter = fn =>
    async function* (src) {
        let i = 0
        for await (const v of src) {
            if (fn(v, i++)) yield v
        }
    }

export const scan = (fn, init) =>
    async function* (src) {
        let acc = init
        let i = 0
        for await (const v of src) {
            if (i++ === 0 && init === undefined) {
                yield (acc = v)
            } else {
                yield (acc = fn(acc, v, i))
            }
        }
    }
