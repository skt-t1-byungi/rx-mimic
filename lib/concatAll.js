import from from './from.js'
import { toIterable } from './Observable.js'

export default function concatAll() {
    return src =>
        async function* () {
            for await (const inner of src()) {
                yield* toIterable(from(inner))
            }
        }
}
