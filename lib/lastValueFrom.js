import from from './from.js'
import { toGenerator } from './Observable.js'
import { VOID } from './utils.js'

export default async function lastValueFrom(src, config) {
    let last = VOID
    for await (const v of toGenerator(from(src))()) {
        last = v
    }
    if (last !== VOID) {
        return last
    }
    if (config) {
        return config.defaultValue
    }
    throw new Error('EmptyError')
}
