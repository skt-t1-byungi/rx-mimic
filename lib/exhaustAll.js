import exhaustMap from './exhaustMap.js'
import { identity } from './utils.js'

export default function exhaustAll() {
    return exhaustMap(identity)
}
