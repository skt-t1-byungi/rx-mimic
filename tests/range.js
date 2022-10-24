import test from 'ava'
import range from '../lib/range.js'

test('range', t =>
    new Promise(end => {
        const values = []
        range(3).subscribe({
            next(value) {
                values.push(value)
            },
            complete() {
                t.deepEqual(values, [0, 1, 2])
                end()
            },
            error: t.log,
        })
    }))

test('range with start', t =>
    new Promise(end => {
        const values = []
        range(1, 3).subscribe({
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
