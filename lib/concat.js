import from from './from.js'
import { AsyncGeneratorObservable, toIterable } from './Observable.js'

export default function concat(...sources) {
    return new AsyncGeneratorObservable(async function* () {
        for (const src of sources) {
            yield* toIterable(from(src))
        }
    })
}
