import filter from './filter'
import take from './take'
import { identity, pipe } from './utils'

export default function first(fn = identity) {
    return pipe(filter(fn), take(1))
}
