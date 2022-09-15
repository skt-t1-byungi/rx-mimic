export default function scan(fn, init) {
    const hasInit = arguments.length > 1
    return src =>
        async function* () {
            let acc = init
            let i = 0
            for await (const v of src()) {
                if (i++ === 0 && !hasInit) {
                    yield (acc = v)
                } else {
                    yield (acc = fn(acc, v, i))
                }
            }
        }
}
