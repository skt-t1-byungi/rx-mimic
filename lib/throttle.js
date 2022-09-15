import from from './from.js'
import first from './first.js'
import Observable, { toGenerator } from './Observable.js'
import { VOID } from './utils.js'

export default function throttle(
    factory,
    { leading = true, trailing = false } = {}
) {
    return src =>
        toGenerator(
            new Observable(observer => {
                let value = VOID
                let done = false
                let throttling = null
                const subscription = from(src()).subscribe({
                    next(v) {
                        value = v
                        if (throttling) {
                            return
                        }
                        if (leading) observer.next(value)
                        throttling = from(factory(v))
                            .pipe(first())
                            .subscribe({
                                next() {
                                    if (trailing) observer.next(value)
                                },
                                complete() {
                                    throttling = null
                                    if (trailing) observer.next(value)
                                    if (done) observer.complete()
                                },
                            })
                    },
                    error(err) {
                        observer.error(err)
                    },
                    complete() {
                        done = true
                        if (!throttling || value === VOID || !trailing) {
                            observer.complete()
                        }
                    },
                })
                return () => {
                    subscription.unsubscribe()
                    throttling?.unsubscribe()
                }
            })
        )
}
