export default function elementAt(index, defaultValue) {
    const hasDefault = arguments.length > 1
    return src =>
        async function* () {
            let i = 0
            for await (const value of src()) {
                if (i === index) {
                    yield value
                    return
                }
                i++
            }
            if (!hasDefault) {
                throw new Error('EmptyError')
            }
            yield defaultValue
        }
}
