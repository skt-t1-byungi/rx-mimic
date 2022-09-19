import from from './from.js'
import { toIterable } from './Observable.js'

export default async function firstValueFrom(src, config) {
    for await (const v of toIterable(from(src))) {
        return v
    }
    if (config) {
        return config.defaultValue
    }
    throw new Error('EmptyError')
}
