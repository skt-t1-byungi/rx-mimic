export default function skip(n) {
    return async function* (src) {
        let i = 0
        for await (const v of src) {
            if (i++ >= n) yield v
        }
    }
}
