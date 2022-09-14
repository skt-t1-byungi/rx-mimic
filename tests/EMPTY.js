import test from 'ava'
import EMPTY from '../lib/EMPTY.js'

test('EMPTY', t =>
    new Promise(end => {
        EMPTY.subscribe({
            next() {
                t.fail()
            },
            complete() {
                t.pass()
                end()
            },
        })
    }))
