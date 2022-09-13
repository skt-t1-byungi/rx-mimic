export default function tap(observer) {
    return async function* (src) {
        const ob = observer
        if (typeof ob === 'function') {
            ob = { next: ob }
        }
        try {
            for await (const v of src) {
                ob?.next(v)
                yield v
            }
            ob?.complete?.()
        } catch (err) {
            ob?.error?.(err)
            throw err
        }
    }
}
