import test from 'ava'
import elementAt from '../lib/elementAt.js'
import of from '../lib/of.js'

test('elementAt', t =>
    new Promise(end => {
        const values = []
        of(1, 2, 3)
            .pipe(elementAt(1))
            .subscribe({
                next(v) {
                    values.push(v)
                },
                complete() {
                    t.deepEqual(values, [2])
                    end()
                },
            })
    }))

test('elementAt with default', t =>
    new Promise(end => {
        const values = []
        of(1, 2, 3)
            .pipe(elementAt(4, 4))
            .subscribe({
                next(v) {
                    values.push(v)
                },
                complete() {
                    t.deepEqual(values, [4])
                    end()
                },
            })
    }))
test('if no value, throw error', t =>
    new Promise(end => {
        of(1, 2, 3)
            .pipe(elementAt(4))
            .subscribe({
                error(err) {
                    t.is(err.message, 'EmptyError')
                    end()
                },
            })
    }))
