export default function tap(observer) {
    return async function* (src) {
        if (typeof observer === 'function') {
            observer = { next: observer }
        }
        try {
            for await (const v of src()) {
                observer?.next(v)
                yield v
            }
        } catch (err) {
            observer?.error?.(err)
            throw err
        }
        observer?.complete?.()
    }
}
