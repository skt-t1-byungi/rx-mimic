import { RawObservable, toGenerator } from './Observable.js'

export default function catchError(handler) {
    return src =>
        async function* () {
            while (true) {
                try {
                    yield* src()
                    break
                } catch (err) {
                    src = handler(err, src)
                    if (src instanceof RawObservable) {
                        src = toGenerator(src)
                    }
                }
            }
        }
}
