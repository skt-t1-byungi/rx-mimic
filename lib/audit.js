import from from './from.js'
import Observable, { toGenerator } from './Observable.js'
import take from './take.js'
import { VOID } from './utils.js'

export default function audit(factory) {
    return src =>
        toGenerator(
            new Observable(observer => {
                let value
                let done = false
                let durationSubscription = null
                const sub = from(src()).subscribe({
                    next(v) {
                        value = v
                        durationSubscription ??= from(factory(v))
                            .pipe(take(1))
                            .subscribe({
                                next() {
                                    durationSubscription = null
                                    if (value !== VOID) {
                                        observer.next(value)
                                        value = VOID
                                    }
                                    if (done) observer.complete()
                                },
                                complete() {
                                    durationSubscription = null
                                    if (done) observer.complete()
                                },
                            })
                    },
                    complete() {
                        done = true
                        if (!durationSubscription) observer.complete()
                    },
                })
                return () => {
                    sub.unsubscribe()
                    durationSubscription?.unsubscribe()
                }
            })
        )
}
