import from from './from.js'
import { toIterable } from './Observable.js'

export default function concatWith(...sources) {
    return src =>
        async function* () {
            yield* src()
            for (const other of sources) {
                yield* toIterable(from(other))
            }
        }
}
