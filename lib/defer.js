import from from './from'
import { RawObservable, toGenerator } from './Observable'

export default function defer(factory) {
    return new RawObservable(async function* () {
        yield* toGenerator(from(factory()))
    })
}
