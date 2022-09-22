import from from './from.js'
import Observable, { toGenerator } from './Observable.js'

export default function buffer(closing) {
    return src =>
        toGenerator(
            new Observable(observer => {
                const buf = []
                const subs = [
                    from(src()).subscribe({
                        ...observer,
                        next(value) {
                            buf.push(value)
                        },
                        complete() {
                            observer.next(buf)
                            observer.complete()
                        },
                    }),
                    from(closing).subscribe({
                        error: observer.error,
                        next() {
                            observer.next(buf.splice(0))
                        },
                    }),
                ]
                return () => subs.forEach(sub => sub.unsubscribe())
            })
        )
}
