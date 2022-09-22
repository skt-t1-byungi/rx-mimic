import from from './from.js'
import Observable, { toGenerator } from './Observable.js'

export default function mergeMap(fn, concurrency = Infinity) {
    return src =>
        toGenerator(
            new Observable(observer => {
                let pending = 1
                const queue = []
                const subs = [
                    from(src()).subscribe({
                        ...observer,
                        next: function subscribeNext(v) {
                            if (pending > concurrency) {
                                queue.push(v)
                                return
                            }
                            pending++
                            const sub = from(fn(v)).subscribe({
                                next(value) {
                                    observer.next(value)
                                },
                                complete() {
                                    pending--
                                    if (queue.length) {
                                        subs.splice(subs.indexOf(sub), 1)
                                        subscribeNext(queue.shift())
                                    } else if (!pending) {
                                        observer.complete()
                                    }
                                },
                            })
                            subs.push(sub)
                        },
                        complete() {
                            if (!--pending && !queue.length) {
                                observer.complete()
                            }
                        },
                    }),
                ]
                return () => subs.forEach(sub => sub.unsubscribe())
            })
        )
}
