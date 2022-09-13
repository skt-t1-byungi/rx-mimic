import Observable from './Observable'

export default function fromEvent(eventEmitter, eventName) {
    return new Observable(observer => {
        const m = eventEmitter
        const listener = ev => observer.next(ev)
        ;(m.addEventListener || m.addListener || m.on).call(
            m,
            eventName,
            listener
        )
        return () => {
            ;(m.removeEventListener || m.removeListener || m.off).call(
                m,
                eventName,
                listener
            )
        }
    })
}
