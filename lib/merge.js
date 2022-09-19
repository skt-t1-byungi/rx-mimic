import from from './from.js'
import mergeAll from './mergeAll.js'

export default function merge(...sources) {
    const concurrency =
        typeof sources[sources.length - 1] === 'number'
            ? sources.pop()
            : Infinity
    return from(sources).pipe(mergeAll(concurrency))
}
