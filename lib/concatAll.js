export default function concatAll() {
    return src =>
        async function* () {
            for await (const inner of src()) {
                yield* inner
            }
        }
}
