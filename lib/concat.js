import from from './from.js'
import { RawObservable, toGenerator } from './Observable.js'

export default function concat(...sources) {
    return new RawObservable(async function* () {
        for (const src of sources) {
            yield* toGenerator(from(src))()
        }
    })
}
