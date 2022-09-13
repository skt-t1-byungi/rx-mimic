import RawObservable from './RawObservable'
import { deferredPromise } from './utils'

export default class Observable extends RawObservable {
    constructor(factory) {
        super(async function* () {
            const buf = []
            let done = false
            let error = null
            let defer = null
            const resolve = () => {
                defer?.resolve()
                defer = null
            }
            const cleanup = factory({
                next(val) {
                    buf.push(val)
                    resolve()
                },
                error(err) {
                    done = true
                    error = err
                    resolve()
                },
                complete() {
                    done = true
                    resolve()
                },
            })
            try {
                while (!done) {
                    if (buf.length) {
                        yield buf.shift()
                    } else {
                        await (defer = deferredPromise()).promise
                        if (error) {
                            throw error
                        }
                    }
                }
            } finally {
                cleanup?.()
            }
        })
    }
}
