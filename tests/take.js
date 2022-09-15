import test from 'ava'
import take from '../lib/take.js'
import of from '../lib/of.js'

test('take', t =>
    new Promise(end => {
        const values = []
        of(1, 2, 3, 4, 5, 6)
            .pipe(take(3))
            .subscribe({
                next(value) {
                    values.push(value)
                },
                complete() {
                    t.deepEqual(values, [1, 2, 3])
                    end()
                },
            })
    }))
