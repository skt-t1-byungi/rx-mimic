import { VOID } from './utils.js'

export default function scan(fn, init = VOID) {
    return src =>
        async function* () {
            let acc = init
            let i = 0
            for await (const v of src()) {
                if (i++ === 0 && init === VOID) {
                    yield (acc = v)
                } else {
                    yield (acc = fn(acc, v, i))
                }
            }
        }
}
