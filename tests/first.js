import test from 'ava'
import first from '../lib/first.js'
import of from '../lib/of.js'

test('first', t =>
    new Promise(end => {
        const values = []
        of(1, 2, 3, 4, 5, 6)
            .pipe(first())
            .subscribe({
                next(value) {
                    values.push(value)
                },
                complete() {
                    t.deepEqual(values, [1])
                    end()
                },
                error: t.log,
            })
    }))

test('first with predicate', t =>
    new Promise(end => {
        const values = []
        of(1, 2, 3, 4, 5, 6)
            .pipe(first(value => value % 2 === 0))
            .subscribe({
                next(value) {
                    values.push(value)
                },
                complete() {
                    t.deepEqual(values, [2])
                    end()
                },
                error: t.log,
            })
    }))

test('first with default', t =>
    new Promise(end => {
        const values = []
        of(1, 2, 3, 4, 5, 6)
            .pipe(first(value => value > 10, 100))
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
            .pipe(first(value => value > 10))
            .subscribe({
                next: t.fail,
                complete: t.fail,
                error(err) {
                    t.is(err.message, 'EmptyError')
                    end()
                },
            })
    }))
