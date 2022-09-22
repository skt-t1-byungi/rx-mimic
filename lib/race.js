import from from './from.js'
import Observable from './Observable.js'

export default function race(...sources) {
    if (sources.length === 1) sources = sources[0]
    return new Observable(observer => {
        let subs = sources.map(src => {
            const sub = from(src).subscribe({
                ...observer,
                next(value) {
                    if (subs.length > 1) {
                        subs.filter(s => s !== sub).forEach(s =>
                            s.unsubscribe()
                        )
                        subs = [sub]
                    }
                    observer.next(value)
                },
            })
            return sub
        })
        return () => subs.forEach(sub => sub.unsubscribe())
    })
}
