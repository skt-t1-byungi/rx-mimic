export default function take(n) {
    return async function* (src) {
        let i = 0
        for await (const v of src) {
            if (i++ < n) yield v
            if (i === n) return
        }
    }
}
