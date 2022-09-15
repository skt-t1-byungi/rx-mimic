import { VOID } from './utils.js'

export default function single(filterer) {
    return src =>
        async function* () {
            let value = VOID
            for await (const v of src()) {
                if (filterer && !filterer(v)) {
                    continue
                }
                if (value !== VOID) {
                    throw new Error('ManyMatchingError')
                }
                value = v
            }
            if (value === VOID) {
                throw new Error('EmptyError')
            }
            yield value
        }
}
