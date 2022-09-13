import Observable from './Observable'

export default function combineLatest(...sources) {
    return new Observable(observer => {
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
                            observer.next(buf.slice())
                        }
                    },
                    error(err) {
                        cleanup()
                        observer.error(err)
                    },
                    complete() {
                        if (++completes === sources.length) {
                            cleanup()
                            observer.complete()
                        }
                    },
                }).unsubscribe
            )
        })
        return cleanup
    })
}
