import Observable from './Observable.js'

export default function interval(ms) {
    return new Observable(observer => {
        let i = 0
        const id = setInterval(() => observer.next(i++), ms)
        return () => clearInterval(id)
    })
}
