export default function takeLast(n) {
    return async function* (src) {
        const buf = []
        for await (const v of src) {
            buf.push(v)
            if (buf.length > n) buf.shift()
        }
        yield* buf
    }
}
