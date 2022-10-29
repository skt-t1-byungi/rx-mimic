import switchMap from './switchMap.js'
import { identity } from './utils.js'

export default function switchAll() {
    return switchMap(identity)
}
