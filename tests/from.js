import test from 'ava'
import from from '../lib/from.js'

test('array', t =>
    new Promise(end => {
        const values = []
        from([1, 2, 3]).subscribe({
            next(value) {
                values.push(value)
            },
            complete() {
                t.deepEqual(values, [1, 2, 3])
                end()
            },
            error: t.log,
        })
    }))

test('arrayLike', t =>
    new Promise(end => {
        const values = []
        from({ length: 3, 0: 1, 1: 2, 2: 3 }).subscribe({
            next(value) {
                values.push(value)
            },
            complete() {
                t.deepEqual(values, [1, 2, 3])
                end()
            },
            error: t.log,
        })
    }))

test('iterable', t =>
    new Promise(end => {
        const values = []
        from(new Set([1, 2, 3])).subscribe({
            next(value) {
                values.push(value)
            },
            complete() {
                t.deepEqual(values, [1, 2, 3])
                end()
            },
            error: t.log,
        })
    }))

test('asyncIterable', t =>
    new Promise(end => {
        const values = []
        from(
            (async function* () {
                yield 1
                yield 2
                yield 3
            })()
        ).subscribe({
            next(value) {
                values.push(value)
            },
            complete() {
                t.deepEqual(values, [1, 2, 3])
                end()
            },
            error: t.log,
        })
    }))

test('promise', t =>
    new Promise(end => {
        const values = []
        from(Promise.resolve(1)).subscribe({
            next(value) {
                values.push(value)
            },
            complete() {
                t.deepEqual(values, [1])
                end()
            },
            error: t.log,
        })
    }))
