import Observable, { toGenerator } from './Observable.js'
import from from './from.js'
import mergeMap from './mergeMap.js'
import tap from './tap.js'

export default function mergeScan(fn, seed) {
    return src =>
        toGenerator(
            new Observable(observer => {
                let acc = seed
                const sub = from(src())
                    .pipe(
                        mergeMap(x =>
                            from(fn(acc, x)).pipe(tap(y => (acc = y)))
                        )
                    )
                    .subscribe(observer)
                return () => sub.unsubscribe()
            })
        )
}
