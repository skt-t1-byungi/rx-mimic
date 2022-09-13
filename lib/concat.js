import from from './from'
import { RawObservable } from './Observable'

export default function concat(...sources) {
    return new RawObservable(async function* () {
        for (const src of sources) {
            yield* toGenerator(from(src))
        }
    })
}
