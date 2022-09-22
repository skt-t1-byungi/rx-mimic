import from from './from.js'
import Observable, { toGenerator } from './Observable.js'

export default function takeUntil(until) {
    return src =>
        toGenerator(
            new Observable(observer => {
                const subs = [
                    from(src()).subscribe(observer),
                    from(until).subscribe({
                        next() {
                            observer.complete()
                        },
                    }),
                ]
                return () => subs.forEach(sub => sub.unsubscribe())
            })
        )
}
