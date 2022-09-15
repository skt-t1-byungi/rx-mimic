export default function startWith(...values) {
    return src =>
        async function* () {
            yield* values
            yield* src()
        }
}
