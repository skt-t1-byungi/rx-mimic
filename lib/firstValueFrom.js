import from from './from.js'
import { toGenerator } from './Observable.js'

export default async function firstValueFrom(src, config) {
    for await (const v of toGenerator(from(src))()) {
        return v
    }
    if (config) {
        return config.defaultValue
    }
    throw new Error('EmptyError')
}
