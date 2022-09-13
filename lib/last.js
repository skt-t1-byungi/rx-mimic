import filter from './filter'
import takeLast from './takeLast'
import { identity, pipe } from './utils'

export default function last(fn = identity) {
    return pipe(filter(fn), takeLast(1))
}
