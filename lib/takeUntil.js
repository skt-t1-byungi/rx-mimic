import from from './from.js'
import Observable, { toGenerator } from './Observable.js'

export default function takeUntil(until) {
    return src =>
        toGenerator(
            new Observable(observer => {
                const offs = [
                    from(src()).subscribe(observer).unsubscribe,
                    from(until).subscribe({
                        next() {
                            observer.complete()
                        },
                    }).unsubscribe,
                ]
                return () => offs.forEach(off => off())
            })
        )
}
