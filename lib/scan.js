export default function scan(fn, init) {
    return async function* (src) {
        let acc = init
        let i = 0
        for await (const v of src) {
            if (i++ === 0 && init === undefined) {
                yield (acc = v)
            } else {
                yield (acc = fn(acc, v, i))
            }
        }
    }
}
