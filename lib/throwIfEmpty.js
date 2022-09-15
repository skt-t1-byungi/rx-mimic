export default function throwIfEmpty(factory) {
    return src =>
        async function* () {
            let seen = false
            for await (const value of src()) {
                seen = true
                yield value
            }
            if (!seen) {
                throw factory()
            }
        }
}
