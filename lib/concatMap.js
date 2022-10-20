import concatAll from './concatAll.js'
import map from './map.js'
import { pipe } from './utils.js'

export default function concatMap(fn) {
    return pipe(map(fn), concatAll())
}
