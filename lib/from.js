import { RawObservable } from './Observable'
import { isArrayLike, isThenable } from './utils'

export default function from(observableLike) {
    const src = observableLike
    if (src instanceof RawObservable) {
        return src
    }
    if (isThenable(src)) {
        return new RawObservable(async function* () {
            yield await src
        })
    }
    return new RawObservable(async function* () {
        yield* isArrayLike(src) ? Array.from(src) : src
    })
}
