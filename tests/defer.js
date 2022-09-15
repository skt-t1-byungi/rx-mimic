import test from 'ava'
import defer from '../lib/defer.js'
import of from '../lib/of.js'

test('defer', t =>
    new Promise(end => {
        let i = 0
        const deferred = defer(() => of(i++))
        deferred.subscribe({})
        t.is(i, 1)
        deferred.subscribe({})
        t.is(i, 2)
        end()
    }))
