export default function catchError(handler) {
    return async function* (src) {
        try {
            yield* src
        } catch (err) {
            yield* handler(err)
        }
    }
}
