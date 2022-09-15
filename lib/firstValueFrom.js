import from from './from.js'
import { toGenerator } from './Observable.js'

export default async function firstValueFrom(src) {
    for await (const v of toGenerator(from(src))()) {
        return v
    }
}
