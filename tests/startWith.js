import test from 'ava'
import startWith from '../lib/startWith.js'
import of from '../lib/of.js'

test('startWith', t =>
    new Promise(end => {
        const values = []
        of(3)
            .pipe(startWith(1, 2))
            .subscribe({
                next(v) {
                    values.push(v)
                },
                complete() {
                    t.deepEqual(values, [1, 2, 3])
                    end()
                },
            })
    }))
