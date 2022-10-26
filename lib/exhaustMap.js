import from from './from.js'
import Observable, { toGenerator } from './Observable.js'

export default function exhaustMap(fn) {
    return src =>
        toGenerator(
            new Observable(observer => {
                let i = 0
                let innerSub = null
                let isCompleted = false
                const sub = from(src()).subscribe({
                    ...observer,
                    next(value) {
                        if (innerSub) return
                        innerSub = from(fn(value, i++)).subscribe({
                            ...observer,
                            next(v) {
                                observer.next(v)
                            },
                            complete() {
                                innerSub = null
                                if (isCompleted) observer.complete()
                            },
                        })
                    },
                    complete() {
                        isCompleted = true
                        if (!innerSub) observer.complete()
                    },
                })
                return () => {
                    sub.unsubscribe()
                    innerSub?.unsubscribe()
                }
            })
        )
}
