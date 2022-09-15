export default function endWith(...values) {
    return src =>
        async function* () {
            yield* src()
            yield* values
        }
}
