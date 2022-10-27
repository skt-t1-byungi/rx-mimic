import mergeMap from './mergeMap.js'
import take from './take.js'
import mapTo from './mapTo.js'

export default function delayWhen(factory) {
    return mergeMap((v, i) => factory(v, i).pipe(take(1), mapTo(v)))
}
