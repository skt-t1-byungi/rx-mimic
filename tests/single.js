import test from 'ava'
import single from '../lib/single.js'
import of from '../lib/of.js'

test('single', t =>
    new Promise(end => {
        const values = []
        of(10)
            .pipe(single())
            .subscribe({
                next(v) {
                    values.push(v)
                },
                complete() {
                    t.deepEqual(values, [10])
                    end()
                },
            })
    }))

test('single with filter', t =>
    new Promise(end => {
        const values = []
        of(1, 2, 3)
            .pipe(single(v => v === 2))
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

test('if no value, throw error', t =>
    new Promise(end => {
        of(1, 2, 3)
            .pipe(single(v => v === 4))
            .subscribe({
                error(err) {
                    t.is(err.message, 'EmptyError')
                    end()
                },
            })
    }))

test('if more than one value, throw error', t =>
    new Promise(end => {
        of(1, 2, 3)
            .pipe(single())
            .subscribe({
                error(err) {
                    t.is(err.message, 'ManyMatchingError')
                    end()
                },
            })
    }))
