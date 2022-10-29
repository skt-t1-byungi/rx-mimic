import from from './from.js'
import Observable, { toGenerator } from './Observable.js'
import switchMap from './switchMap.js'
import tap from './tap.js'

export default function switchScan(fn, seed) {
    return src =>
        toGenerator(
            new Observable(observer => {
                let acc = seed
                const sub = from(src())
                    .pipe(
                        switchMap(x =>
                            from(fn(acc, x)).pipe(tap(y => (acc = y)))
                        )
                    )
                    .subscribe(observer)
                return () => sub.unsubscribe()
            })
        )
}
