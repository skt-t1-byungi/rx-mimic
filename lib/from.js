import RawObservable from './RawObservable'

export default function from(source) {
    const src = source
    if (src instanceof RawObservable) {
        return src
    }
    if (typeof src?.then === 'function') {
        return new RawObservable(async function* () {
            yield await src
        })
    }
    return new RawObservable(async function* () {
        if (!Array.isArray(src) && typeof src.length === 'number') {
            src = Array.from(src)
        }
        yield* src
    })
}
