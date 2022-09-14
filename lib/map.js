export default function map(fn) {
    return async function* (src) {
        let i = 0
        for await (const v of src()) yield fn(v, i++)
    }
}
