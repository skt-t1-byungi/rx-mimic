import { AsyncGeneratorObservable, toGenerator } from './Observable.js'

export default function catchError(handler) {
    return src =>
        async function* () {
            while (true) {
                try {
                    yield* src()
                    break
                } catch (err) {
                    src = handler(err, new AsyncGeneratorObservable(src))
                    if (src instanceof AsyncGeneratorObservable) {
                        src = toGenerator(src)
                    }
                }
            }
        }
}
