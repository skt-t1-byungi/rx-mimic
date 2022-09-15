import defaultIfEmpty from './defaultIfEmpty.js'
import filter from './filter.js'
import take from './take.js'
import throwIfEmpty from './throwIfEmpty.js'
import { identity, pipe, VOID } from './utils.js'

export default function first(fn, defaults = VOID) {
    return pipe(
        fn ? filter(fn) : identity,
        take(1),
        defaults === VOID
            ? throwIfEmpty(() => new Error('EmptyError'))
            : defaultIfEmpty(defaults)
    )
}
