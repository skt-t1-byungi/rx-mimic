import from from './from.js'
import { toGenerator } from './Observable.js'

export default async function lastValueFrom(src) {
    let last
    for await (const v of toGenerator(from(src))()) {
        last = v
    }
    return last
}
