import Observable, { toGenerator } from './Observable.js'
import from from './from.js'
import map from './map.js'

export default function bufferTime(
    ms,
    creationInterval = null,
    size = Infinity
) {
    return src =>
        toGenerator(
            new Observable(observer => {
                const buffersByTid = new Map()
                const creationTid =
                    creationInterval && setInterval(doRecord, creationInterval)

                doRecord()

                function doRecord() {
                    const buf = []
                    const tid = setTimeout(() => {
                        flush(tid)
                        if (!creationTid) doRecord()
                    }, ms)
                    buffersByTid.set(tid, buf)
                }
                function flush(tid) {
                    const buf = buffersByTid.get(tid)
                    clearTimeout(tid)
                    buffersByTid.delete(tid)
                    observer.next(buf)
                }

                const sub = from(src()).subscribe({
                    ...observer,
                    next(value) {
                        for (const [tid, buf] of Array.from(
                            buffersByTid.entries()
                        )) {
                            buf.push(value)
                            if (buf.length === size) {
                                flush(tid)
                                if (!creationTid) doRecord()
                            }
                        }
                    },
                    complete() {
                        buffersByTid.forEach((_, tid) => flush(tid))
                        observer.complete()
                    },
                })
                return () => {
                    sub.unsubscribe()
                    buffersByTid.forEach((_, tid) => clearTimeout(tid))
                    buffersByTid.clear()
                    if (creationTid) clearInterval(creationTid)
                }
            })
        )
}
