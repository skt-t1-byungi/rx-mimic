import from from './from'
import Observable, { toGenerator } from './Observable'

export default function takeUntil(until) {
    return src =>
        toGenerator(
            new Observable(observer => {
                const offs = [
                    src.subscribe(observer).unsubscribe,
                    from(until).subscribe({
                        next() {
                            observer.complete()
                        },
                    }).unsubscribe,
                ]
                return () => offs.forEach(off => off())
            })
        )
}
