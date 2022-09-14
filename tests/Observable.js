import test from 'ava'
import Observable, { RawObservable } from '../lib/Observable.js'

test('subscribe', t =>
    new Promise(end => {
        const values = []
        new RawObservable(async function* () {
            yield 1
            yield 2
            yield 3
        }).subscribe({
            next(value) {
                values.push(value)
            },
            complete() {
                t.deepEqual(values, [1, 2, 3])
                end()
            },
        })
    }))

test('unsubscribe', t =>
    new Promise(end => {
        t.plan(2)
        const values = []
        const subscription = new RawObservable(async function* () {
            try {
                yield 1
                t.fail()
                yield 2
                yield 3
            } finally {
                t.pass()
            }
        }).subscribe({
            next(value) {
                values.push(value)
                subscription.unsubscribe()
            },
            complete() {
                t.fail()
            },
        })
        setImmediate(() => {
            t.deepEqual(values, [1])
            end()
        })
    }))

test('synchronous push/complete', t => {
    return new Promise(end => {
        t.plan(2)
        const values = []
        new Observable(observer => {
            observer.next(1)
            observer.next(2)
            observer.next(3)
            observer.complete()
            return t.pass
        }).subscribe(v => values.push(v))
        setImmediate(() => {
            t.deepEqual(values, [1, 2, 3])
            end()
        })
    })
})

test('asynchronous push', t =>
    new Promise(end => {
        t.plan(2)
        const values = []
        new Observable(observer => {
            setImmediate(() => {
                observer.next(1)
                observer.next(2)
                observer.next(3)
                observer.complete()
            })
            return t.pass
        }).subscribe(v => values.push(v))
        setImmediate(() => {
            t.deepEqual(values, [1, 2, 3])
            end()
        })
    }))

test('synchronous error', t =>
    new Promise(end => {
        t.plan(3)
        new Observable(observer => {
            observer.next(1)
            observer.error(new Error('test'))
            observer.next(2)
            observer.complete()
            return t.pass
        }).subscribe({
            next(value) {
                t.is(value, 1)
            },
            error(err) {
                t.is(err.message, 'test')
                end()
            },
        })
    }))
