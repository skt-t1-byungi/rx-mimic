import from from './from.js'

export default function range(start, count) {
    if (!count) {
        ;[start, count] = [0, start]
    }
    return from(Array.from({ length: count }, (_, i) => start + i))
}
