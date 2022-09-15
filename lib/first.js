import defaultIfEmpty from './defaultIfEmpty.js'
import filter from './filter.js'
import take from './take.js'
import throwIfEmpty from './throwIfEmpty.js'
import { identity, pipe } from './utils.js'

export default function first(fn, defaults) {
    return pipe(
        fn ? filter(fn) : identity,
        take(1),
        arguments.length > 1
            ? defaultIfEmpty(defaults)
            : throwIfEmpty(() => new Error('EmptyError'))
    )
}
