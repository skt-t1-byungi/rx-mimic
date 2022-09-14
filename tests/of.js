import test from 'ava'
import of from '../lib/of.js'

test('of', t =>
    new Promise(end => {
        const values = []
        of(1, 2, 3).subscribe({
            next(value) {
                values.push(value)
            },
            complete() {
                t.deepEqual(values, [1, 2, 3])
                end()
            },
        })
    }))
