export default function skipLast(n) {
    return async function* (src) {
        const buf = []
        for await (const v of src) {
            buf.push(v)
            if (buf.length > n) yield buf.shift()
        }
    }
}
