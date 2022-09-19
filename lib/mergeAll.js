import mergeMap from './mergeMap.js'
import { identity } from './utils.js'

export default function mergeAll(concurrency = Infinity) {
    return mergeMap(identity, concurrency)
}
