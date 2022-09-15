import test from 'ava'
import scan from '../lib/scan.js'
import of from '../lib/of.js'

test('scan', t =>
    new Promise(end => {
        const values = []
        of(1, 2, 3)
            .pipe(scan((acc, v) => acc + v))
            .subscribe({
                next(value) {
                    values.push(value)
                },
                complete() {
                    t.deepEqual(values, [1, 3, 6])
                    end()
                },
                error: t.log,
            })
    }))

test('scan with initial value', t =>
    new Promise(end => {
        const values = []
        of(1, 2, 3)
            .pipe(scan((acc, v) => acc + v, 10))
            .subscribe({
                next(value) {
                    values.push(value)
                },
                complete() {
                    t.deepEqual(values, [11, 13, 16])
                    end()
                },
                error: t.log,
            })
    }))
