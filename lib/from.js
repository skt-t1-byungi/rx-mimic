import { AsyncGeneratorObservable } from './Observable.js'
import { isArrayLike, isThenable } from './utils.js'

export default function from(observableLike) {
    const input = observableLike
    if (input instanceof AsyncGeneratorObservable) {
        return input
    }
    if (isThenable(input)) {
        return new AsyncGeneratorObservable(async function* () {
            yield await input
        })
    }
    return new AsyncGeneratorObservable(async function* () {
        yield* isArrayLike(input) ? Array.from(input) : input
    })
}
