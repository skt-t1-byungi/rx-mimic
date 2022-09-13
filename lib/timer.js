import EMPTY from './EMPTY'
import interval from './interval'
import Observable from './Observable'

export default function timer(ms, intervalTime) {
    return concat(
        new Observable(observer => {
            const id = setTimeout(observer.next, ms, 0)
            return () => clearTimeout(id)
        }),
        intervalTime ? interval(intervalTime) : EMPTY
    )
}
