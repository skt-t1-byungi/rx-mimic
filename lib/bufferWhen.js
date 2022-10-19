import from from './from.js'
import Observable, { toGenerator } from './Observable.js'

export default function bufferWhen(factory) {
    return src =>
        toGenerator(
            new Observable(observer => {
                let buf, until
                ;(function start() {
                    buf = []
                    until = from(factory()).subscribe({
                        error: observer.error,
                        next() {
                            until.unsubscribe()
                            observer.next(buf)
                            start()
                        },
                    })
                })()
                const sub = from(src()).subscribe({
                    ...observer,
                    next(value) {
                        buf.push(value)
                    },
                    complete() {
                        if (buf.length) observer.next(buf)
                        observer.complete()
                    },
                })
                return () => {
                    sub.unsubscribe()
                    until?.unsubscribe()
                }
            })
        )
}
