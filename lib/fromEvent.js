import fromEventPattern from './fromEventPattern.js'

export default function fromEvent(target, eventName, options, selector) {
    const t = target
    return fromEventPattern(
        handler =>
            (t.addEventListener || t.addListener || t.on).call(
                t,
                eventName,
                handler,
                options
            ),
        handler =>
            (t.removeEventListener || t.removeListener || t.off).call(
                t,
                eventName,
                handler,
                options
            ),
        selector
    )
}
