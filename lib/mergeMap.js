import from from './from.js'
import Observable, { toGenerator } from './Observable.js'

export default function mergeMap(fn, concurrency = Infinity) {
    return src =>
        toGenerator(
            new Observable(observer => {
                let pending = 1
                const queue = []
                const offs = [
                    from(src()).subscribe({
                        next: function subscribeNext(v) {
                            if (pending > concurrency) {
                                queue.push(v)
                                return
                            }
                            pending++
                            const off = from(fn(v)).subscribe({
                                next(value) {
                                    observer.next(value)
                                },
                                complete() {
                                    pending--
                                    if (queue.length) {
                                        offs.splice(offs.indexOf(off), 1)
                                        subscribeNext(queue.shift())
                                    } else if (!pending) {
                                        observer.complete()
                                    }
                                },
                            }).unsubscribe
                            offs.push(off)
                        },
                        complete() {
                            if (!--pending && !queue.length) {
                                observer.complete()
                            }
                        },
                    }).unsubscribe,
                ]
                return () => offs.forEach(off => off())
            })
        )
}
