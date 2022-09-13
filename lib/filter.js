export default function filter(fn) {
    return async function* (src) {
        let i = 0
        for await (const v of src) {
            if (fn(v, i++)) yield v
        }
    }
}
