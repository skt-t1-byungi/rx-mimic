import Observable, { toGenerator } from './Observable.js'
import from from './from.js'
import take from './take.js'

export default function bufferToggle(opener, factory) {
    return src =>
        toGenerator(
            new Observable(observer => {
                const buffers = new Set()
                const closeSubs = new Set()
                const openSub = from(opener).subscribe({
                    error: observer.error,
                    next(value) {
                        const buf = []
                        buffers.add(buf)
                        const closeSub = from(factory(value))
                            .pipe(take(1))
                            .subscribe({
                                error: observer.error,
                                next() {
                                    buffers.delete(buf)
                                    closeSubs.delete(closeSub)
                                    observer.next(buf)
                                },
                            })
                        closeSubs.add(closeSub)
                    },
                })
                const sub = from(src()).subscribe({
                    ...observer,
                    next(value) {
                        buffers.forEach(buf => buf.push(value))
                    },
                    complete() {
                        buffers.forEach(buf => observer.next(buf))
                        observer.complete()
                    },
                })
                return () => {
                    openSub.unsubscribe()
                    closeSubs.forEach(sub => sub.unsubscribe())
                    sub.unsubscribe()
                }
            })
        )
}
