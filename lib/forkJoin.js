import lastValueFrom from './lastValueFrom.js'
import { AsyncGeneratorObservable } from './Observable.js'

export default function forkJoin(...sources) {
    if (sources.length === 1) [sources] = sources
    const isArr = Array.isArray(sources)
    return new AsyncGeneratorObservable(async function* () {
        const results = await Promise.all(
            Object.entries(sources).map(([k, src]) =>
                lastValueFrom(src).then(value => (isArr ? value : [k, value]))
            )
        )
        yield isArr ? results : Object.fromEntries(results)
    })
}
