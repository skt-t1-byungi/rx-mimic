import from from './from'
import { toGenerator } from './RawObservable'

export default async function lastValueFrom(src) {
    let last
    for await (const v of toGenerator(from(src))) {
        last = v
    }
    return last
}
