import from from './from.js'
import Observable from './Observable.js'
import { VOID } from './utils.js'

export default function combineLatest(...sources) {
    return new Observable(observer => {
        if (sources.length === 1) [sources] = sources
        const isArr = Array.isArray(sources)
        const buf = Array((sources = Object.entries(sources)).length).fill(VOID)
        let completes = 0
        const subs = sources.map(([k, src], i) =>
            from(src).subscribe({
                ...observer,
                next(value) {
                    buf[i] = isArr ? value : [k, value]
                    if (buf.every(v => v !== VOID)) {
                        observer.next(
                            isArr ? buf.slice() : Object.fromEntries(buf)
                        )
                    }
                },
                complete() {
                    if (++completes === sources.length) {
                        observer.complete()
                    }
                },
            })
        )
        return () => subs.forEach(sub => sub.unsubscribe())
    })
}
