import { pipe } from './utils.js'
import filter from './filter.js'
import take from './take.js'
import defaultIfEmpty from './defaultIfEmpty.js'
import throwIfEmpty from './throwIfEmpty.js'

export default function elementAt(index, defaultValue) {
    return pipe(
        filter((_, i) => i === index),
        take(1),
        arguments.length > 1
            ? defaultIfEmpty(defaultValue)
            : throwIfEmpty(() => new Error('EmptyError'))
    )
}
