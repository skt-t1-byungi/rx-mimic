import from from './from.js'
import { RawObservable, toGenerator } from './Observable.js'

export default function defer(factory) {
    return new RawObservable(async function* () {
        yield* toGenerator(from(factory()))
    })
}
