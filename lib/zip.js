import Observable from './Observable.js'

export default function zip(...sources) {
    return new Observable(observer => {
        const buffers = sources.map(() => [])
        const completes = sources.map(() => false)
        const subs = sources.map((src, i) =>
            src.subscribe({
                ...observer,
                next(value) {
                    buffers[i].push(value)
                    if (buffers.every(buf => buf.length)) {
                        observer.next(buffers.map(buf => buf.shift()))
                        if (
                            buffers.some(
                                (buf, i) => !buf.length && completes[i]
                            )
                        ) {
                            observer.complete()
                        }
                    }
                },
                complete() {
                    completes[i] = true
                    if (!buffers[i].length) observer.complete()
                },
            })
        )
        return () => {
            subs.forEach(sub => sub.unsubscribe())
        }
    })
}
