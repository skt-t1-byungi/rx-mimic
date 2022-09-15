import { RawObservable } from './Observable.js'
import { isArrayLike, isThenable } from './utils.js'

export default function from(observableLike) {
    const input = observableLike
    if (input instanceof RawObservable) {
        return input
    }
    if (isThenable(input)) {
        return new RawObservable(async function* () {
            yield await input
        })
    }
    return new RawObservable(async function* () {
        yield* isArrayLike(input) ? Array.from(input) : input
    })
}
