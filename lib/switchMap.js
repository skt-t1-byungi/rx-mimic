import from from './from.js'
import Observable, { toGenerator } from './Observable.js'

export default function switchMap(fn) {
    return src =>
        toGenerator(
            new Observable(observer => {
                let i = -1
                let innerSub = null
                let isCompleted = false
                const sub = from(src()).subscribe({
                    ...observer,
                    next(value) {
                        const currIndex = ++i
                        innerSub?.unsubscribe()
                        innerSub = from(fn(value, currIndex)).subscribe({
                            ...observer,
                            next(v) {
                                observer.next(v)
                            },
                            complete() {
                                if (currIndex === i) innerSub = null
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
