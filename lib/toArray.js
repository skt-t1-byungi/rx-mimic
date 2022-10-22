export default function toArray() {
    return src =>
        async function* () {
            const values = []
            for await (const value of src()) {
                values.push(value)
            }
            yield values
        }
}
