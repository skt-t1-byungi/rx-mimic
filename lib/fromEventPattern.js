import Observable from './Observable.js'
import { identity } from './utils.js'

export default function fromEventPattern(
    addHandler,
    removeHandler,
    selector = identity
) {
    return new Observable(observer => {
        const handler = (...args) => observer.next(selector(...args))
        addHandler(handler)
        return () => removeHandler(handler)
    })
}
