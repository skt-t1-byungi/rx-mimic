export default function map(fn) {
    return src =>
        async function* () {
            let i = 0
            for await (const v of src()) yield fn(v, i++)
        }
}
