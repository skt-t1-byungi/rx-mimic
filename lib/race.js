import from from './from.js'
import Observable from './Observable.js'

export default function race(...sources) {
    if (sources.length === 1) sources = sources[0]
    return new Observable(observer => {
        let offs = sources.map(src => {
            const off = from(src).subscribe({
                next(value) {
                    if (offs.length > 1) {
                        offs.filter(f => f !== off).forEach(off => off())
                        offs = [off]
                    }
                    observer.next(value)
                },
                error: observer.error,
                complete: observer.complete,
            }).unsubscribe
            return off
        })
        return () => offs.forEach(off => off())
    })
}
