export default function bufferCount(n, startN = n) {
    return src =>
        async function* () {
            const buf = []
            for await (const v of src()) {
                buf.push(v)
                if (buf.length === n) {
                    yield buf.slice()
                    buf.splice(0, startN)
                }
            }
            if (buf.length) yield buf
        }
}
