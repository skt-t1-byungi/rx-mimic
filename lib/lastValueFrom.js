import from from './from'
import { toGenerator } from './Observable'

export default async function lastValueFrom(src) {
    let last
    for await (const v of toGenerator(from(src))) {
        last = v
    }
    return last
}
