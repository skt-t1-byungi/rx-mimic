import from from './from.js'
import { AsyncGeneratorObservable, toIterable } from './Observable.js'

export default function defer(factory) {
    return new AsyncGeneratorObservable(async function* () {
        yield* toIterable(from(factory()))
    })
}
