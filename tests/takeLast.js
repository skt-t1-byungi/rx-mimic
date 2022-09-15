import test from 'ava'
import takeLast from '../lib/takeLast.js'
import of from '../lib/of.js'

test('takeLast', t =>
    new Promise(end => {
        const values = []
        of(1, 2, 3, 4, 5)
            .pipe(takeLast(2))
            .subscribe({
                next(value) {
                    values.push(value)
                },
                complete() {
                    t.deepEqual(values, [4, 5])
                    end()
                },
                error: t.log,
            })
    }))
