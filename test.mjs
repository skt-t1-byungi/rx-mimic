import { test } from 'tap'
import { from, take, fromEvent } from './index.mjs'
import { EventEmitter } from 'node:events'

test('subscribe', t => {
    t.plan(4)
    const stub = [1, 2, 3]
    const arr = []
    from(stub).subscribe(n => {
        arr.push(n)
        t.pass()
        if (arr.length === 3) {
            t.same(arr, [1, 2, 3])
            t.end()
        }
    })
})

test('unsubscribe', t => {
    t.plan(3)
    let cnt = 0
    const unsubscribe = from(Array(5)).subscribe(n => {
        t.pass()
        if (++cnt === 3) {
            unsubscribe()
        }
        if (cnt > 3) {
            t.fail()
        }
    })
})

test('take', t => {
    t.plan(3)
    from([1, 2, 3, 4, 5])
        .pipe(take(3))
        .subscribe(() => t.pass())
})

test('fromEvent', t => {
    t.plan(3)
    const ee = new EventEmitter()
    const originRemover = ee.removeListener
    ee.removeListener = (...args) => {
        originRemover.call(ee, ...args)
        t.pass()
        t.end()
    }
    fromEvent(ee, 'test')
        .pipe(take(2))
        .subscribe(() => t.pass())
    ee.emit('test')
    ee.emit('test')
})
