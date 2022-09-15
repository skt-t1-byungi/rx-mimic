import defaultIfEmpty from './defaultIfEmpty.js'
import filter from './filter.js'
import takeLast from './takeLast.js'
import throwIfEmpty from './throwIfEmpty.js'
import { identity, pipe, VOID } from './utils.js'

export default function last(fn, defaults = VOID) {
    return pipe(
        fn ? filter(fn) : identity,
        takeLast(1),
        defaults === VOID
            ? throwIfEmpty(() => new Error('EmptyError'))
            : defaultIfEmpty(defaults)
    )
}
