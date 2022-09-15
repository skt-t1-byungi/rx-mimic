export default function defaultIfEmpty(defaultValue) {
    return src =>
        async function* () {
            let seen = false
            for await (const value of src()) {
                seen = true
                yield value
            }
            if (!seen) {
                yield defaultValue
            }
        }
}
