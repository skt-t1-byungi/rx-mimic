import from from './from'

export default function takeUntil(until) {
    return src =>
        new Observable(observer => {
            src.subscribe(observer)
            ;(until = from(until)).subscribe({
                next() {
                    observer.complete()
                },
            })
            return () => {
                src.unsubscribe()
                until.unsubscribe()
            }
        })
}
