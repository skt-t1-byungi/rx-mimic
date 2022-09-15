import defaultIfEmpty from './defaultIfEmpty.js'
import filter from './filter.js'
import takeLast from './takeLast.js'
import throwIfEmpty from './throwIfEmpty.js'
import { identity, pipe } from './utils.js'

export default function last(fn, defaults) {
    return pipe(
        fn ? filter(fn) : identity,
        takeLast(1),
        arguments.length > 1
            ? defaultIfEmpty(defaults)
            : throwIfEmpty(() => new Error('EmptyError'))
    )
}
