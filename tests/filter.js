import test from 'ava'
import filter from '../lib/filter.js'
import of from '../lib/of.js'

test('filter', t =>
    new Promise(end => {
        const values = []
        of(1, 2, 3, 4, 5, 6)
            .pipe(filter(value => value % 2 === 0))
            .subscribe({
                next(value) {
                    values.push(value)
                },
                complete() {
                    t.deepEqual(values, [2, 4, 6])
                    end()
                },
                error: t.log,
            })
    }))
