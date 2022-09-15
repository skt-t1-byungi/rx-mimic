import concat from './concat.js'
import Observable from './Observable.js'
import interval from './interval.js'
import EMPTY from './EMPTY.js'
import map from './map.js'

export default function timer(startTime, intervalTime) {
    return concat(
        new Observable(observer => {
            const id = setTimeout(() => {
                observer.next(0)
                observer.complete()
            }, startTime)
            return () => clearTimeout(id)
        }),
        intervalTime ? interval(intervalTime).pipe(map(n => n + 1)) : EMPTY
    )
}
