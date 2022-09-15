import test from 'ava'
import skipLast from '../lib/skipLast.js'
import of from '../lib/of.js'

test('skipLast', t =>
    new Promise(end => {
        const values = []
        of(1, 2, 3, 4, 5, 6)
            .pipe(skipLast(2))
            .subscribe({
                next(value) {
                    values.push(value)
                },
                complete() {
                    t.deepEqual(values, [1, 2, 3, 4])
                    end()
                },
            })
    }))
