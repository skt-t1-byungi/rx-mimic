export default function delay(ms) {
    return src =>
        async function* () {
            for await (const value of src()) {
                await new Promise(r => setTimeout(r, ms))
                yield value
            }
        }
}
