import filter from './filter.js'

export default function partition(src, fn) {
    return [src.pipe(filter(fn)), src.pipe(filter(v => !fn(v)))]
}
