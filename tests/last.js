import test from 'ava'
import last from '../lib/last.js'
import of from '../lib/of.js'

test('last', t =>
    new Promise(end => {
        const values = []
        of(1, 2, 3)
            .pipe(last())
            .subscribe({
                next(value) {
                    values.push(value)
                },
                complete() {
                    t.deepEqual(values, [3])
                    end()
                },
                error: t.log,
            })
    }))

test('last with predicate', t =>
    new Promise(end => {
        const values = []
        of(1, 2, 3, 4)
            .pipe(last(value => value % 2 === 0))
            .subscribe({
                next(value) {
                    values.push(value)
                },
                complete() {
                    t.deepEqual(values, [4])
                    end()
                },
                error: t.log,
            })
    }))

test('last with default', t =>
    new Promise(end => {
        const values = []
        of(1, 2, 3, 4, 5, 6)
            .pipe(last(value => value > 10, 100))
            .subscribe({
                next(value) {
                    values.push(value)
                },
                complete() {
                    t.deepEqual(values, [100])
                    end()
                },
                error: t.log,
            })
    }))

test('if no value, throw error', t =>
    new Promise(end => {
        of(1, 2, 3, 4, 5, 6)
            .pipe(last(value => value > 10))
            .subscribe({
                error(err) {
                    t.is(err.message, 'EmptyError')
                    end()
                },
            })
    }))
