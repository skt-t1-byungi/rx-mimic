export const pipe = (...fns) =>
    fns.reduce(
        (prev, fn) =>
            (...args) =>
                fn(prev(...args))
    )

export const from = src => {
    if (src.isObservable) {
        return src
    } else if (typeof src?.then === 'function') {
        src = (async function* () {
            yield await src
        })()
    } else if (!Array.isArray(src) && typeof src.length === 'number') {
        src = Array.from(src)
    }
    return {
        isObservable: true,
        pipe(...operators) {
            return from(pipe(...operators)(src))
        },
        subscribe(fn) {
            const iter = tap(fn)(src)
            ;(async () => {
                for await (const _ of iter);
            })()
            return () => {
                iter.return()
            }
        },
    }
}

export const defer = fn => from(fn())

export const of = (...args) => from(args)

export const fromEvent = (mitt, name) =>
    defer(async function* () {
        let resolve
        const buf = []
        const push = ev => {
            if (resolve) {
                resolve(ev)
                resolve = null
            } else {
                buf.push(ev)
            }
        }
        ;(mitt.addEventListener || mitt.addListener || mitt.on).call(mitt, name, push)
        try {
            while (true) {
                yield await (buf.length ? buf.shift() : new Promise(r => (resolve = r)))
            }
        } finally {
            ;(mitt.removeEventListener || mitt.removeListener || mitt.off).call(mitt, name, push)
        }
    })

export const interval = ms => {
    let id
    return fromEvent({
        on(_, push) {
            id = setInterval(push, ms)
        },
        off() {
            clearInterval(id)
        },
    })
}

export const concat = (...sources) =>
    defer(async function* () {
        for (const src of sources) {
            yield* from(src)
        }
    })

export const combineLatest = (...sources) => {
    const VOID = {}
    const buf = Array(sources.length).fill(VOID)
    const offs = []
    return fromEvent({
        on(_, push) {
            sources.forEach((src, i) => {
                offs.push(
                    from(src).subscribe(v => {
                        buf[i] = v
                        if (buf.every(v => v !== VOID)) {
                            push(buf)
                        }
                    })
                )
            })
        },
        off() {
            offs.forEach(fn => fn())
        },
    })
}

export const tap = fn =>
    async function* (src) {
        for await (const v of src) {
            yield fn(v), v
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

export const mapTo = v => map(() => v)

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
