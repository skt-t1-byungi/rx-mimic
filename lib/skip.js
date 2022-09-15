export default function skip(n) {
    return src =>
        async function* () {
            let i = 0
            for await (const v of src()) {
                if (i++ >= n) yield v
            }
        }
}
